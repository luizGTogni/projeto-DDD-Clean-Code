import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name
    );
  }

  private async sendNewQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(
      questionComment.questionId.toString()
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário na sua pergunta`,
        content: `Um comentário feito na sua pergunta "${question.title.substring(0, 20).concat('...')}"`,
      });
    }
  }
}
