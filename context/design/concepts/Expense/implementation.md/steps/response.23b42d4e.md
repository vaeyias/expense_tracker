---
timestamp: 'Sat Oct 11 2025 11:10:39 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_111039.0ce6825d.md]]'
content_id: 23b42d4e1ec7d1dfaeb2ad518697af3b76395a3241d06720c73ff73903978ab4
---

# response:

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Generic types for LikertSurvey
type User = ID;
type Survey = ID;
type Question = ID;
type Response = ID;

const PREFIX = "LikertSurvey" + ".";

/**
 * Represents a single response to a question within a survey.
 * Each response is linked to a specific user, question, and the survey it belongs to.
 */
interface Responses {
  _id: Response;
  userId: User;
  questionId: Question;
  surveyId: Survey;
  value: number; // The Likert scale value (e.g., 1-5)
}

/**
 * Represents a single question within a Likert survey.
 * Questions are associated with a specific survey.
 */
interface Questions {
  _id: Question;
  surveyId: Survey;
  text: string;
  scaleMin: number; // Minimum value of the Likert scale for this question
  scaleMax: number; // Maximum value of the Likert scale for this question
}

/**
 * Represents a Likert survey, which consists of multiple questions.
 */
interface Surveys {
  _id: Survey;
  title: string;
  description: string;
  createdBy: User;
}

export default class LikertSurveyConcept {
  responses: Collection<Responses>;
  questions: Collection<Questions>;
  surveys: Collection<Surveys>;

  constructor(private readonly db: Db) {
    this.responses = this.db.collection(PREFIX + "responses");
    this.questions = this.db.collection(PREFIX + "questions");
    this.surveys = this.db.collection(PREFIX + "surveys");
  }

  /**
   * Creates a new Likert survey.
   * @param title The title of the survey.
   * @param description A brief description of the survey.
   * @param createdBy The ID of the user who created the survey.
   * @returns An object containing the ID of the newly created survey.
   */
  createSurvey({
    title,
    description,
    createdBy,
  }: {
    title: string;
    description: string;
    createdBy: User;
  }): { survey: Survey } {
    const surveyId: Survey = freshID();
    const newSurvey: Surveys = {
      _id: surveyId,
      title,
      description,
      createdBy,
    };
    this.surveys.insertOne(newSurvey);
    return { survey: surveyId };
  }

  /**
   * Adds a question to an existing survey.
   * @param surveyId The ID of the survey to which the question will be added.
   * @param text The text of the question.
   * @param scaleMin The minimum value of the Likert scale for this question.
   * @param scaleMax The maximum value of the Likert scale for this question.
   * @returns An object containing the ID of the newly created question.
   */
  addQuestion({
    surveyId,
    text,
    scaleMin,
    scaleMax,
  }: {
    surveyId: Survey;
    text: string;
    scaleMin: number;
    scaleMax: number;
  }): { question: Question } {
    const questionId: Question = freshID();
    const newQuestion: Questions = {
      _id: questionId,
      surveyId,
      text,
      scaleMin,
      scaleMax,
    };
    this.questions.insertOne(newQuestion);
    return { question: questionId };
  }

  /**
   * Records a response to a specific question within a survey by a user.
   * @param userId The ID of the user providing the response.
   * @param questionId The ID of the question being answered.
   * @param surveyId The ID of the survey the question belongs to.
   * @param value The Likert scale value chosen by the user.
   * @returns An object containing the ID of the newly created response.
   */
  submitResponse({
    userId,
    questionId,
    surveyId,
    value,
  }: {
    userId: User;
    questionId: Question;
    surveyId: Survey;
    value: number;
  }): { response: Response } {
    // Basic validation: Ensure the question and survey exist and the value is within scale
    // In a full implementation, these checks would be more robust and potentially involve queries.
    // For simplicity, we'll assume valid inputs and focus on the core operation.

    const existingQuestion = this.questions.findOne({ _id: questionId });
    if (!existingQuestion) {
      throw new Error(`Question with ID ${questionId} not found.`);
    }
    if (existingQuestion.surveyId !== surveyId) {
      throw new Error(`Question ${questionId} does not belong to survey ${surveyId}.`);
    }
    if (value < existingQuestion.scaleMin || value > existingQuestion.scaleMax) {
      throw new Error(
        `Response value ${value} is outside the scale for question ${questionId} (${existingQuestion.scaleMin}-${existingQuestion.scaleMax}).`
      );
    }

    // Prevent duplicate responses from the same user to the same question in the same survey
    const existingResponse = this.responses.findOne({
      userId,
      questionId,
      surveyId,
    });
    if (existingResponse) {
      throw new Error(`User ${userId} has already responded to question ${questionId} in survey ${surveyId}.`);
    }

    const responseId: Response = freshID();
    const newResponse: Responses = {
      _id: responseId,
      userId,
      questionId,
      surveyId,
      value,
    };
    this.responses.insertOne(newResponse);
    return { response: responseId };
  }

  /**
   * Retrieves all questions belonging to a specific survey.
   * @param surveyId The ID of the survey.
   * @returns An array of question objects.
   */
  _getQuestionsForSurvey({ surveyId }: { surveyId: Survey }): {
    _id: Question;
    surveyId: Survey;
    text: string;
    scaleMin: number;
    scaleMax: number;
  }[] {
    return this.questions.find({ surveyId }).toArray();
  }

  /**
   * Retrieves all responses for a specific question within a survey.
   * @param questionId The ID of the question.
   * @param surveyId The ID of the survey.
   * @returns An array of response objects.
   */
  _getResponsesForQuestion({
    questionId,
    surveyId,
  }: {
    questionId: Question;
    surveyId: Survey;
  }): {
    _id: Response;
    userId: User;
    questionId: Question;
    surveyId: Survey;
    value: number;
  }[] {
    return this.responses.find({ questionId, surveyId }).toArray();
  }

  /**
   * Retrieves the average response value for a specific question within a survey.
   * @param questionId The ID of the question.
   * @param surveyId The ID of the survey.
   * @returns An object containing the average value, or an error if no responses exist.
   */
  _getAverageResponseValueForQuestion({
    questionId,
    surveyId,
  }: {
    questionId: Question;
    surveyId: Survey;
  }): { average: number } | { error: string } {
    const responses = this.responses.find({ questionId, surveyId }).toArray();

    if (responses.length === 0) {
      return { error: "No responses found for this question." };
    }

    const sum = responses.reduce((acc, response) => acc + response.value, 0);
    const average = sum / responses.length;
    return { average };
  }

  /**
   * Retrieves all responses submitted by a specific user across all surveys.
   * @param userId The ID of the user.
   * @returns An array of response objects.
   */
  _getResponsesByUser({ userId }: { userId: User }): {
    _id: Response;
    userId: User;
    questionId: Question;
    surveyId: Survey;
    value: number;
  }[] {
    return this.responses.find({ userId }).toArray();
  }
}
```
