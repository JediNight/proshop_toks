import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Must be at least 4 characters")
    .max(20, "Must be less than 20 characters")
    .required("This field is required")
    .matches(/^[a-zA-Z0-9_ ]*$/, "Cannot contain special characters or spaces"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
    .required("Password is required"),
  changepassword: Yup.string().when("password", {
    is: (val) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref("password")],
      "Both password need to be the same"
    ),
  }),
});

const RegisterScreen = ({ history, location }) => {
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Formik
        validationSchema={schema}
        initialValues={{
          name: "",
          email: "",
          password: "",
          changepassword: "",
        }}
        onSubmit={(values) => {
          dispatch(register(values.name, values.email, values.password));
        }}
      >
        {({
          isSubmitting,
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                isInvalid={!!errors.name && touched.name}
                isValid={touched.name && !errors.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                isInvalid={!!errors.email && touched.email}
                isValid={touched.email && !errors.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                isValid={touched.password && !errors.password}
                isInvalid={!!errors.password && touched.password}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                name="changepassword"
                value={values.changepassword}
                isInvalid={
                  !!errors.changepassword ||
                  (values.changepassword === "" && touched.changepassword)
                }
                isValid={
                  touched.changepassword &&
                  !errors.changepassword &&
                  !errors.password &&
                  touched.password
                }
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {!!errors.changepassword ||
              (values.changepassword === "" && touched.changepassword) ? (
                <Form.Control.Feedback type="invalid">
                  {errors.changepassword}
                </Form.Control.Feedback>
              ) : (
                <Form.Control.Feedback>Passwords Match</Form.Control.Feedback>
              )}
            </Form.Group>

            <Button type="submit" variant="primary">
              Register
            </Button>
          </Form>
        )}
      </Formik>
      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
