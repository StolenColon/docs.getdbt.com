import React, { useState } from 'react';
import { Widget } from '@happyreact/react';
 
import '@happyreact/react/theme.css';
 
const VotedYes = () => {
  return <span>Thanks for your feedback. We are glad you like it :)</span>;
};
 
const VotedNo = () => {
  return <span>Thanks for your feedback. We will try to improve :(</span>;
};
 
export default function Feedback({ resource }) {
  const [reaction, setReaction] = useState(null);
 
  const isReacted = reaction === 'Yes' || reaction === 'No';
  const _resource = String(resource).replace(/\//g, '-');
 
  const handleReaction = (params) => {
    setReaction(params.icon);
  };
 
  return (
    <div>
      <h3>Was this page helpful?</h3>
      {!isReacted ? (
        <div>
          <Widget
            token="[7920edff-1749-4303-ae2d-da69cee1b0c7]"
            resource={_resource}
            onReaction={handleReaction}
          />
        </div>
      ) : reaction === 'No' ? (
        <VotedNo />
      ) : (
        <VotedYes />
      )}
    </div>
  );
}
