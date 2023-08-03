import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  View,
  Card,
} from "@aws-amplify/ui-react";

function App({ signOut }) {
  return (
    <View className="App">
      <Card>
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeS1TF4BpCjDtZRo7gTOLeL0rGw6JncIm0aZyh-LuyMBEowRQ/viewform?embedded=true" width="640" height="1867" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);