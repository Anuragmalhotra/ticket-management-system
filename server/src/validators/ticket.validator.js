import { body, param, query } from 'express-validator';
import {
  forbidStatusOnTicketBodyValidator,
  optionalAssignmentValidator,
  optionalDescriptionValidator,
  optionalPriorityFilterValidator,
  optionalPriorityValidator,
  optionalStatusFilterValidator,
  optionalTitleValidator,
  requiredCommentBodyValidator,
  requiredDescriptionValidator,
  requiredMongoIdValidator,
  requiredStatusValidator,
  requiredTitleValidator,
} from './shared/fieldValidators.js';

export const listTicketsValidator = [
  query('search')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Search must be a string')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query cannot exceed 200 characters'),
  optionalStatusFilterValidator(),
  optionalPriorityFilterValidator(),
  query('sortBy')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('sortBy must be a string')
    .trim()
    .isIn(['title', 'status', 'priority', 'createdAt', 'updatedAt'])
    .withMessage('sortBy must be one of: title, status, priority, createdAt, updatedAt'),
  query('sortOrder')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('sortOrder must be a string')
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const createTicketValidator = [
  requiredTitleValidator(),
  requiredDescriptionValidator(),
  optionalPriorityValidator(),
  requiredMongoIdValidator('createdBy', 'Created by user'),
  optionalAssignmentValidator(),
  forbidStatusOnTicketBodyValidator('create'),
];

export const updateTicketValidator = [
  param('id').isMongoId().withMessage('Invalid ticket ID'),
  body().custom((_value, { req }) => {
    const { title, description, priority, assignedTo } = req.body;
    const hasUpdate =
      title !== undefined ||
      description !== undefined ||
      priority !== undefined ||
      assignedTo !== undefined;

    if (!hasUpdate) {
      throw new Error('At least one field is required to update');
    }

    return true;
  }),
  optionalTitleValidator(),
  optionalDescriptionValidator(),
  optionalPriorityValidator(),
  optionalAssignmentValidator(),
  forbidStatusOnTicketBodyValidator('update'),
];

export const updateTicketStatusValidator = [
  param('id').isMongoId().withMessage('Invalid ticket ID'),
  requiredStatusValidator(),
];

export const ticketIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid ticket ID'),
];
