import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  // useQuery,
  useSubscription,
  useMutation,
} from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Row, Col, FormInput, Button } from "shards-react";

const link = new WebSocketLink({
  uri: 'ws://localhost:4000/',
  options: {
    reconnect: true
  }
})

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      content
      user
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

function Messages({ user }) {
  const { data } = useSubscription(GET_MESSAGES);

  if (!data) {
    return null;
  }

  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
          }}
          key={id}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "2px solid #e5e6ea",
                borderRadius: 25,
                textAlign: "center",
                fontSize: "18pt",
                paddingTop: 5,
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? "#58bf56" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
  );
}

function Chat() {
  const [state, setState] = useState({
    user: "Jack",
    content: "",
  });

  const [postMessage, { data }] = useMutation(ADD_MESSAGE);

  const handleOnChange = (field) => (evt) =>
    setState({
      ...state,
      [field]: evt.target.value,
    });

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }

    setState({
      ...state,
      content: "",
    });
  };

  const handlerOnKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      onSend();
    }
  };

  return (
    <Container>
      <Messages user="Jack" />
      <Row>
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            label="user"
            value={state.user}
            onChange={handleOnChange("user")}
          />
        </Col>
        <Col xs={8}>
          <FormInput
            label="content"
            value={state.content}
            onChange={handleOnChange("content")}
            onKeyUp={handlerOnKeyUp}
          />
        </Col>
        <Col>
          <Button onClick={onSend}>Send</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default function () {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}
