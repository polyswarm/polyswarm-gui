class WebSocket {
  constructor() {
    // this.triggerAssertion();
  }

  triggerAssertion() {
    return setTimeout(() => {
      const onmessage = this.onmessage;
      if (onmessage) {
        const assertion = {
          Type: 'Assertion',
          Body: {
            Author: 'asdf',
            Bid: 50,
            Metadata: 'Nothing to see here',
            verdicts: [false, false]
          }
        };
        onmessage(assertion);
      }
      triggerAssertion();
    });
  }
}
export default WebSocket;
