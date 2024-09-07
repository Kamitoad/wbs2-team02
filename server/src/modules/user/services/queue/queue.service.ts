import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../../database/User";
import {Repository} from "typeorm";
import {GamedataGateway} from "../../../admin/gateways/gamedata/gamedata.gateway";
import {QueueGateway} from "../../gateways/queue/queue.gateway";

@Injectable()
export class QueueService {
    //private intervals: Map<number, NodeJS.Timeout> = new Map();

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private gamedataGateway: GamedataGateway,
        private queueGateway: QueueGateway,
    ) {}

    async addToQueue(userId: number): Promise<void> {
        const user = await this.userRepository.findOne( { where: { userId } });
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }
        if (user.inQueue) {
            throw new BadRequestException("Nutzer bereits in der Queue");
        }

        user.queueStartTime = new Date(Date.now()).toISOString();
        user.inQueue = true;
        await this.userRepository.save(user);

        await this.gamedataGateway.handleJoinQueue(user);
    }

    async removeFromQueue(userId: number): Promise<void> {
        const user = await this.userRepository.findOne( { where: { userId } });
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }
        if (!user.inQueue) {
            throw new BadRequestException("Nutzer nicht in der Queue");
        }

        user.queueStartTime = null;
        user.inQueue = false;
        await this.userRepository.save(user);

        await this.gamedataGateway.handleLeaveQueue(user);
    }

    async getUserQueueDuration(userId: number): Promise<number> {
        const user = await this.userRepository.findOne( { where: { userId } });
        if (!user?.queueStartTime) {
            throw new NotFoundException('Benutzer ist nicht in der Queue');
        }
        // Waiting time in seconds
        return this.calcQueueDuration(user.queueStartTime);
    }

    /**
     * Calculates the time between now and {queueStartTimeDate} in seconds
     * @param queueStartTimeDate {string}: 2024-01-01T12:30:00.000Z
     */
    calcQueueDuration(queueStartTimeDate: string): number {
        const now = Date.now();
        const queueStartTime = new Date(queueStartTimeDate).getTime();

        return Math.floor((now - queueStartTime) / 1000);
    }

    // May be not needed, time could be calculated on clients side
    /*
    async updateQueueTime(userId: number) {

        const timeInQueue = this.getUserQueueDuration(userId);
        this.queueGateway.sendQueueTime(userId, timeInQueue);
    }
    */
}
