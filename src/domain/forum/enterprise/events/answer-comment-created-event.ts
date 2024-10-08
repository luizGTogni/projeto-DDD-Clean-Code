import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';
import type { AnswerComment } from '../entities/answer-comment';

export class AnswerCommentCreatedEvent implements DomainEvent {
  public answerComment: AnswerComment;
  public ocurredAt: Date;

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id;
  }
}
