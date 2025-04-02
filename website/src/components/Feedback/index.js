import React, { useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

export default function Feedback({ resource }) {
  const isBrowser = useIsBrowser();
  const [voted, setVoted] = useState(null);
  const [comments, setComments] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isBrowser) return null;

  const handleVote = (value) => {
    setVoted(value);
    if (value === 'yes') {
      sendFeedback({ resource, vote: 'yes' });
    }
  };

  const sendFeedback = async (data) => {
    const formBody = new URLSearchParams({
      resource: data.resource || '',
      vote: data.vote || '',
      comment: data.comment || '',
      email: data.email || '',
    });
    console.log('Form data being sent:', Object.fromEntries(formBody));
    console.log('📩 Submitting feedback:', data);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbz4OPLX6SCNbdq_te6_j7JiC8poK3s3wgC54wMQlic7keQga4-khnYJkF5syH_1SivVQg/exec', {
        method: 'POST',
        mode: 'cors',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      const result = await response.json();
      console.log('Response:', result);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      // Optionally handle the error in the UI
    }
  };

  const handleSubmit = () => {
    sendFeedback({ 
      resource, 
      vote: 'no', 
      comment: comments,
      email: email
    });
    setSubmitted(true);
  };

  return (
    <div className={styles.feedbackContainer}>
      {voted === 'yes' && <span className={styles.thankYouMessage}>Thanks for your feedback!</span>}
      {voted === 'no' && !submitted && (
        <>
          <h3 className={styles.prompt}>How can we improve this page?</h3>
          <div className={styles.inputContainer}>
            <textarea
              rows={4}
              placeholder="Your feedback..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.submitButton}>
              Submit feedback
            </button>
          </div>
        </>
      )}
      {!voted && (
        <>
          <h3 className={styles.prompt}>Was this page helpful?</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => handleVote('yes')}
              aria-label="Yes"
              className={styles.voteButton}
            >
              <FontAwesomeIcon icon={faThumbsUp} style={{ width: '.2em', height: '.2em' }} />
            </button>
            <button
              onClick={() => handleVote('no')}
              aria-label="No"
              className={styles.voteButton}
            >
              <FontAwesomeIcon icon={faThumbsDown} style={{ width: '.2em', height: '.2em' }} />
            </button>
          </div>
        </>
      )}
      {submitted && <span className={styles.thankYouMessage}>Thanks! We appreciate your feedback.</span>}
    </div>
  );
}
