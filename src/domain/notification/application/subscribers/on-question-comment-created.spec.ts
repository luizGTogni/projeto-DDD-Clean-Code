import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { waitFor } from 'test/utils/wait-for';
import type { MockInstance } from 'vitest';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { OnQuestionCommentCreated } from './on-question-comment-created';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe('On Question Comment Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    inMemoryNotificationRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute');

    new OnQuestionCommentCreated(inMemoryQuestionsRepository, sut);
  });

  it('should send a notification when an question comment is created', async () => {
    const question = makeQuestion();
    const questionComment = makeQuestionComment({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryQuestionCommentsRepository.create(questionComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
