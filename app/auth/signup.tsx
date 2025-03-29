import PasswordField from "@/components/default/textfield/password";
import { verifyEmail, verifyID, verifyPassword } from "@/helper/verify";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useGlobalToast } from "@/hooks/useToast";
import { useMutation } from "react-query";
import useRequest, { getURL } from "@/api/request";

import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Alpha from "@/helper/alpha";

async function SignUpAccount(signUpData: any) {
  return await useRequest({
    url: (await getURL()).API.USERS.CREATE,
    method: "POST" as const,
    payload: signUpData,
  });
}

function VerifyField(data: {
  fname: string;
  lname: string;
  id: string;
  email: string;
  password: string;
}) {
  if (!data.fname) throw new Error("First name is required");
  if (!data.lname) throw new Error("Last name is required");
  if (!data.id) throw new Error("ID number is required");
  if (!verifyID(data.id, true)) throw new Error("Invalid ID number");
  if (!data.email) throw new Error("Email is required");
  if (!verifyEmail(data.email, true))
    throw new Error("Use a valid DYCI email address");
  // if (!data.password) throw new Error("Password is required");
  // if (!(data.password.length >= 8))
  //   throw new Error("Password must be at least 8 characters");
  return true;
}

function SignUp() {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useGlobalToast();
  const [confimPass, setConfirmPass] = useState("");
  const [signUpData, setSignUpData] = useState({
    fname: "",
    lname: "",
    id: "",
    email: "",
    password: "",
  });

  const handleEdit = (key: string, value: string) => {
    setSignUpData({ ...signUpData, [key]: value });
  };

  const payload = {
    profile_pic: null,
    first_name: signUpData.fname,
    last_name: signUpData.lname,
    email: signUpData.email,
    password: signUpData.password,
    school_id: signUpData.id,
    role_id: "U5ER",
    is_verified: false,
  };

  const { data, isLoading, mutate } = useMutation(SignUpAccount, {
    onSuccess: (data: any) => {
      if (!data.success) {
        showToast("An error occured. Please try again later.", "error");
        return;
      }
      // console.log(data);
      showToast("Sign up successful", "success");
      router.replace("/auth/login");
    },
    onError: (error: any) => {
      showToast("An error occured", "error");
    },
  });
  const handleSignUp = () => {
    try {
      VerifyField(signUpData);
      // if (signUpData.password !== confimPass) {
      // 	Alert.alert("Try Again.", "Passwords do not match");
      // 	return
      // }
      showToast("Signing up...", "info");
      mutate([payload]);
    } catch (error: any) {
      Alert.alert("Try Again.", error.message);
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          width: "100%",
          height: "100%",
          paddingHorizontal: 40,
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.1)",
          gap: 20,
          paddingVertical: 20,
        }}
      >
        <View>
          <Text
            style={{ color: theme.colors.onBackground }}
            variant="headlineSmall"
          >
            Welcome to Bibliotech
          </Text>
          <Text style={{ color: theme.colors.outline }} variant="labelLarge">
            Sign up to continue
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          <TextInput
            contentStyle={{ color: theme.colors.onBackground }}
            label={"First Name"}
            mode="outlined"
            onChangeText={(value: string) => handleEdit("fname", value)}
          />
          <TextInput
            contentStyle={{ color: theme.colors.onBackground }}
            label={"Last Name"}
            mode="outlined"
            onChangeText={(value: string) => handleEdit("lname", value)}
          />
          <TextInput
            contentStyle={{ color: theme.colors.onBackground }}
            label={"ID Number"}
            mode="outlined"
            onChangeText={(value: string) => handleEdit("id", value)}
          />
          <TextInput
            contentStyle={{ color: theme.colors.onBackground }}
            label={"Email"}
            mode="outlined"
            onChangeText={(value: string) => handleEdit("email", value)}
          />
          {/* <PasswordField
            label={"Password"}
            mode="outlined"
            onChangeText={(value: string) => handleEdit("password", value)}
          />
          <PasswordField
            label={"Confirm Password"}
            mode="outlined"
            onChangeText={(value: string) => setConfirmPass(value)}
          /> */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button
              style={{ borderColor: theme.colors.primary }}
              mode="outlined"
              onPress={() => router.replace("/auth/login")}
            >
              Log In
            </Button>
            <Button mode="contained" onPress={handleSignUp}>
              Sign Up
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default SignUp;
