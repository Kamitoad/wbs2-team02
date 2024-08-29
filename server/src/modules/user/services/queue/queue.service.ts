import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../../database/User";
import {Repository} from "typeorm";
import {QueueGateway} from "../../gateways/queue/queue.gateway";

@Injectable()
export class QueueService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private queueGateway: QueueGateway,
    ) {}

    async addToQueue(userId: number): Promise<void> {
        const user = await this.userRepository.findOne( { where: { userId } });
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }

        user.queueStartTime = new Date(Date.now()).toISOString();
        user.inQueue = true;
        await this.userRepository.save(user);
    }

    async removeFromQueue(userId: number): Promise<void> {
        const user = await this.userRepository.findOne( { where: { userId } });
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }

        user.queueStartTime = null;
        user.inQueue = false;
        await this.userRepository.save(user);
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
     *  Calculates the time between now in seconds
     * @param {string} queueStartTimeDate
     */

    calcQueueDuration(queueStartTimeDate: string): number {
        const now = Date.now();
        const queueStartTime = new Date(queueStartTimeDate).getTime();

        return Math.floor((now - queueStartTime) / 1000);
    }

    async updateQueueTime(userId: number) {
        const timeInQueue = this.getUserQueueDuration(userId);
        this.queueGateway.sendQueueTime(userId, timeInQueue);
    }
}
