import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { waitFor } from 'test/utils/wait-for';
import type { MockInstance } from 'vitest';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { OnAnswerCreated } from './on-answer-created';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository;
let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository();
    inMemoryNotificationRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute');

    new OnAnswerCreated(inMemoryQuestionsRepository, sut);
  });

  it('should send a notification when an answer comment is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });
    const answerComment = makeAnswerComment({ answerId: answer.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswerRepository.create(answer);
    inMemoryAnswerCommentRepository.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
