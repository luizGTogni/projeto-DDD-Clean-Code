import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';
import type { Question } from '../entities/question';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public question: Question;
  public bestAnswerId: UniqueEntityID;
  public ocurredAt: Date;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
