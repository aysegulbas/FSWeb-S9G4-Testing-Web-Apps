import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
beforeEach(() => {
  render(<IletisimFormu />);
});
test("hata olmadan render ediliyor", () => {});

test("iletişim formu headerı render ediliyor", () => {
  //   const element = screen.getByRole("heading");
  //   expect(element).toHaveTextContent("İletişim Formu");
  expect(screen.getByRole("heading")).toHaveTextContent("İletişim Formu");

  //
  //   const header = screen.getByText(/İletişim Formu/i);
  //   expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const name = screen.getByLabelText("Ad*");
  userEvent.type(name, "abcd");
  const err = screen.getAllByTestId("error");
  expect(err.length).toBe(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const but = screen.getByRole("button");
  userEvent.click(but);
  const err = screen.getAllByTestId("error");
  expect(err.length).toBe(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const name = screen.getByLabelText("Ad*");
  userEvent.type(name, "aysegul");
  const surname = screen.getByLabelText("Soyad*");
  userEvent.type(surname, "bas");
  const but = screen.getByRole("button");
  userEvent.click(but);
  const err = screen.getAllByTestId("error");
  expect(err.length).toBe(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const email = screen.getByRole("textbox", { name: /email\*/i });
  userEvent.type(email, "aysegul");
  const err = screen.getByTestId("error");
  expect(err).toHaveTextContent("email geçerli bir email adresi olmalıdır.");
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const name = screen.getByLabelText("Ad*");
  userEvent.type(name, "aysegul");
  const email = screen.getByRole("textbox", { name: /email\*/i });
  userEvent.type(email, "aysegul@aysegul.com");
  const but = screen.getByRole("button");
  userEvent.click(but);
  const err = screen.getByTestId("error");
  expect(err).toHaveTextContent("soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const name = screen.getByLabelText("Ad*");
  userEvent.type(name, "aysegul");
  const surname = screen.getByLabelText("Soyad*");
  userEvent.type(surname, "bas");
  const email = screen.getByRole("textbox", { name: /email\*/i });
  userEvent.type(email, "aysegul@aysegul.com");
  const but = screen.getByRole("button");
  userEvent.click(but);
  const err = screen.queryAllByTestId("error");
  expect(err.length).toBe(0);
  //   const err = screen.queryByTestId("error");
  //   expect(err).toBe(null);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const isim = "aysegul";
  const name = screen.getByLabelText("Ad*");
  userEvent.type(name, isim);
  const surname = screen.getByLabelText("Soyad*");
  userEvent.type(surname, "bas");
  const email = screen.getByRole("textbox", { name: /email\*/i });
  userEvent.type(email, "aysegul@aysegul.com");
  const mesaj = screen.getByLabelText("Mesaj");
  userEvent.type(mesaj, "hello");
  const but = screen.getByRole("button");
  userEvent.click(but);
  expect(screen.queryByTestId("firstnameDisplay")).toHaveTextContent(isim);
  expect(screen.queryByTestId("lastnameDisplay").textContent).toBe(
    "Soyad: bas"
  );
  expect(screen.queryByTestId("emailDisplay")).toBeInTheDocument();
  expect(screen.queryByTestId("messageDisplay")).toHaveTextContent("hello");
});
