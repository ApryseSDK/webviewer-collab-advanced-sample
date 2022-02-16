import React, { useRef, useState, useCallback } from 'react';
import { Box, Heading, Keyboard, FormField, TextInput, List, Button, Paragraph } from 'grommet';

export type InviteListProps = {
  onSubmit: (users: string[]) => void;
  buttonDisabled?: boolean;
  buttonLabel?: string;
};

export default ({ onSubmit, buttonDisabled = false, buttonLabel = 'Go!' }: InviteListProps) => {
  const invitedRef = useRef(null);
  const [invited, setInvited] = useState([]);

  const addUser = () => {
    const { value } = invitedRef.current;
    setInvited((old) => {
      return [...old, value];
    });
    invitedRef.current.value = '';
  };

  const submit = useCallback(() => {
    const { value } = invitedRef.current;
    let all: string[] = [...invited];
    if (value) {
      all.push(value);
    }

    all = all.map((i) => i.trim());
    onSubmit(all);
  }, [onSubmit, invited]);

  return (
    <Box>
      <Heading level="3" margin={{ top: 'none', bottom: 'none' }} textAlign="center">
        Invite people
      </Heading>

      <Paragraph size="small" textAlign="center">
        Don't have someone to invite? Open the app in another browser or an incognito window and
        invite yourself! You can find your fake email in the bottom left corner.
      </Paragraph>

      <Keyboard onEnter={addUser} target="component">
        <FormField htmlFor="add-user" label="Email" margin={{ bottom: 'none' }}>
          <TextInput id="add-user" ref={invitedRef} placeholder="email@address.com" />
        </FormField>
      </Keyboard>

      <Box>
        <List
          primaryKey="email"
          data={invited.map((email) => ({ email }))}
          background="light-1"
          margin={{ bottom: 'small', top: 'none' }}
          pad="xsmall"
        />
      </Box>

      <Button
        primary
        label={buttonLabel}
        margin={{ top: 'auto' }}
        disabled={buttonDisabled}
        onClick={submit}
      />
    </Box>
  );
};
