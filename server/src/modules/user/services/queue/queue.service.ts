import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../../database/User";
import {Repository} from "typeorm";

@Injectable()
export class QueueService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

        const now = Date.now();
        const queueStartTime = new Date(user.queueStartTime).getTime();

        const duration = now - queueStartTime;

        console.log(Math.floor(duration / 1000))
        // Waiting time in seconds
        return Math.floor(duration / 1000);
    }

    // Later for Gateway

    /*
    async updateQueueTime(userId: number) {
        const timeInQueue = this.calculateTimeInQueue(userId);
        this.queueGateway.sendQueueTime(userId, timeInQueue);
    }

    private calculateTimeInQueue(userId: number): number {
        const user = await this.userRepository.findOne(userId);
        const now = new Date();
        return Math.floor((now.getTime() - user.queueStartTime.getTime()) / 1000);
    }
    */
}
