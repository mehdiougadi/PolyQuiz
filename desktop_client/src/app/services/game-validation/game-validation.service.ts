import { Injectable } from '@angular/core';
import { ValidatorResult, validate } from 'jsonschema';

const gameSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    description: 'A quiz',
    type: 'object',
    properties: {
        id: {
            description: 'The unique identifier of the quiz',
            type: 'string',
        },
        title: {
            description: 'The title of the quiz',
            type: 'string',
        },
        duration: {
            description: 'Maximum time for a QCM question in seconds',
            type: 'number',
        },
        lastModification: {
            description: 'The last modification date-time of the quiz in ISO8601 format',
            type: ['string', 'null'],
            format: 'date-time',
        },
        questions: {
            description: 'All questions part of the quiz',
            type: 'array',
            items: {
                description: 'A quiz question',
                type: 'object',
                properties: {
                    type: {
                        description: 'The type of quiz. Multiple Choice (QCM) or Open Response (QRL)',
                        type: 'string',
                        enum: ['QCM', 'QRL'],
                    },
                    text: {
                        description: 'The question itself',
                        type: 'string',
                    },
                    points: {
                        description: 'The number of points assigned to the question. Has to be a multiple of 10.',
                        type: 'number',
                    },
                    choices: {
                        description: 'The list of choices',
                        type: ['array'],
                        minItems: 2,
                        items: {
                            description: 'A choice',
                            type: 'object',
                            properties: {
                                text: {
                                    description: 'The choice itself',
                                    type: 'string',
                                },
                                isCorrect: {
                                    description: 'A boolean which is true only when the choice is a correct answer',
                                    type: ['boolean', 'null'],
                                },
                            },
                            required: ['text'],
                        },
                    },
                },
                if: {
                    properties: {
                        type: {
                            const: 'QRL',
                        },
                    },
                },
                then: {
                    required: ['type', 'text', 'points'],
                    properties: {
                        choices: {
                            type: 'null',
                        },
                    },
                },
                else: {
                    required: ['type', 'text', 'points', 'choices'],
                },
            },
        },
    },
    required: ['id', 'title', 'duration', 'questions'],
};

@Injectable({
    providedIn: 'root',
})
export class GameValidationService {
    validateGame(game: unknown): ValidatorResult {
        return validate(game, gameSchema);
    }
}
