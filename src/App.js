import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import {
  withAuthenticator,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
} from '@aws-amplify/ui-react';
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const App = ({ user, signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }
  

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }
  return (
    <View className="App">
      <Text alignSelf="flex-start">Logged in as <b>{user.username}</b><Button variation='link' onClick={signOut}>Sign out</Button></Text>
      <Heading level={1} margin="2rem 0">Infinite Goods Onboarding</Heading>
      <View as="form" margin="3rem 30rem" onSubmit={createNote}>
        <Flex direction="column" justifyContent="center">
          <Heading level={5}> Brand name</Heading>
          <TextField
            name="name"
            placeholder="Short answer text"
            label="Brand Name"
            labelHidden
            variation="quiet"
            required
          />
          <Heading level={5}>Short description</Heading>
          <TextField
            name="description"
            placeholder="Please describe your brand in less than 10 words"
            label="Brand Description"
            labelHidden
            variation="quiet"
            required
          />
          <Heading level={5}>Brand Image</Heading>
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />
          <Button type="submit" variation="primary" margin="0 5rem">
            Submit 
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Submission</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
            <Text as="span">{note.description}</Text>
            {note.image && (
              <Image
                src={note.image}
                alt={`visual aid for ${notes.name}`}
                style={{ width: 100 }}
              />
            )}
            <Button  variation="link" onClick={() => deleteNote(note)}>
              Delete Submission
            </Button>
          </Flex>
        ))}
      </View>
    </View>
  );
};

export default withAuthenticator(App);

