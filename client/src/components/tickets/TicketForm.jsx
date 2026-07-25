import { useEffect, useMemo, useState } from 'react';
import FormField from '../common/FormField.jsx';
import FormActions from '../common/FormActions.jsx';
import FormErrorSummary from '../common/FormErrorSummary.jsx';
import PrioritySelector from './PrioritySelector.jsx';
import UserSelect from './UserSelect.jsx';
import { getEntityId } from '../../utils/entity.js';
import { validateTicketForm } from '../../utils/validation.js';

const EMPTY_INITIAL_VALUES = Object.freeze({});
const EMPTY_USERS = Object.freeze([]);
const EMPTY_ERRORS = Object.freeze({});

const TicketForm = ({
  mode = 'create',
  initialValues = EMPTY_INITIAL_VALUES,
  users = EMPTY_USERS,
  errors: externalErrors = EMPTY_ERRORS,
  isSubmitting = false,
  onSubmit,
  onCancel,
}) => {
  const defaultCreatedBy = useMemo(
    () => users.find((user) => user.role === 'customer')?._id ?? users[0]?._id ?? '',
    [users],
  );

  const initialTitle = initialValues.title ?? '';
  const initialDescription = initialValues.description ?? '';
  const initialPriority = initialValues.priority ?? 'medium';
  const initialCreatedBy = getEntityId(initialValues.createdBy) ?? defaultCreatedBy;
  const initialAssignedTo = getEntityId(initialValues.assignedTo);

  const [values, setValues] = useState({
    title: initialTitle,
    description: initialDescription,
    priority: initialPriority,
    createdBy: initialCreatedBy,
    assignedTo: initialAssignedTo,
  });
  const [errors, setErrors] = useState({});

  // Sync from props only when the source values actually change (not on every new object identity).
  // Using `initialValues` / default `{}` as a dependency remounted form state on every keystroke.
  useEffect(() => {
    setValues({
      title: initialTitle,
      description: initialDescription,
      priority: initialPriority,
      createdBy: initialCreatedBy,
      assignedTo: initialAssignedTo,
    });
  }, [initialTitle, initialDescription, initialPriority, initialCreatedBy, initialAssignedTo]);

  const mergedErrors = { ...errors, ...externalErrors };

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateTicketForm(values, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      assignedTo: values.assignedTo || null,
    };

    if (mode === 'create') {
      payload.createdBy = values.createdBy;
    }

    await onSubmit?.(payload);
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <FormErrorSummary errors={mergedErrors} />

      <FormField label="Title" name="title" required error={mergedErrors.title}>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
        />
      </FormField>

      <FormField label="Description" name="description" required error={mergedErrors.description}>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </FormField>

      <FormField label="Priority" name="priority">
        <PrioritySelector
          value={values.priority}
          onChange={(priority) => updateField('priority', priority)}
        />
      </FormField>

      {mode === 'create' && (
        <UserSelect
          label="Created By"
          users={users}
          value={values.createdBy}
          onChange={(createdBy) => updateField('createdBy', createdBy)}
          error={mergedErrors.createdBy}
        />
      )}

      <UserSelect
        label="Assign To"
        users={users.filter((user) => ['agent', 'manager', 'admin'].includes(user.role))}
        value={values.assignedTo}
        onChange={(assignedTo) => updateField('assignedTo', assignedTo)}
        allowEmpty
      />

      <FormActions
        onCancel={onCancel}
        submitLabel={mode === 'create' ? 'Create Ticket' : 'Save Changes'}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default TicketForm;
