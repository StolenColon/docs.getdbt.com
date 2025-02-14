import React, { useState, useEffect } from 'react';
import { Widget } from '@happyreact/react';
import '@happyreact/react/theme.css';
import styles from './styles.module.css';

const VotedYes = () => <span>Thanks for your feedback. We are glad you like it! 😊</span>;
const VotedNo = () => <span>Thanks for your feedback. We will try to improve! 😔</span>;

export default function Feedback({ resource }) {
  const [reaction, setReaction] = useState(null);

  const isReacted = reaction === 'Yes' || reaction === 'No';
  const _resource = String(resource).replace(/\//g, '-');

  useEffect(() => {
    console.log("Feedback component received resource:", resource);
  }, [resource]);

  const handleReaction = (params) => {
    setReaction(params.icon);
  };

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>Was this page helpful?</h3>
      {!isReacted ? (
        <div className="">
          <Widget
            token="7920edff-1749-4303-ae2d-da69cee1b0c7"
            resource={_resource}
            classes={{
              root: styles.widget,
              container: styles.container,
              grid: styles.grid,
              cell: styles.cell,
              reaction: styles.reaction,
            }}
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
