import type { Answer } from '../entities/answer';
import type { AnswerRepository } from '../repositories/answer-repository';
import { AnswerQuestionUseCase } from './answer-question';

const fakeAnswerRepository: AnswerRepository = {
  create: async (answer: Answer) => {
    return;
  }
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository);

  const answer = await answerQuestion.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova Resposta',
  });

  expect(answer.content).toEqual('Nova Resposta');
})