import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, test, expect, vi, afterEach} from "vitest";
import App from "./App";

const originalFetch = globalThis.fetch; 
afterEach(() => { globalThis.fetch = originalFetch; vi.clearAllMocks(); });

describe("Registration Form", () => {
    test("should display Registration Form heading", () => {
        render(<App />);
        const heading = screen.getByText("Registration Form");
        expect(heading).toBeInTheDocument();
    });

    test("should display all form fields", () => {
        render(<App />);
        const nameInput = screen.getByLabelText("Name:");
        const emailInput = screen.getByLabelText("Email ID:");
        const phoneInput = screen.getByLabelText("Phone:");

        expect(nameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(phoneInput).toBeInTheDocument();
    });

    test("should display gender redio buttons", ()=>{
        render(<App />);
        const maleRadio = screen.getByLabelText("Male");
        const femaleRadio = screen.getByLabelText("Female");

        expect(maleRadio).toBeInTheDocument();
        expect(femaleRadio).toBeInTheDocument();
    });

    test("should display Register button", ()=>{
        render(<App />);

        const registerButton = screen.getByRole("button", {
            name:"Register"
        });

        expect(registerButton).toBeInTheDocument();
    });


    test("should allow user to enter registration information", async () => {
        const user = userEvent.setup();

        render(<App />);

        const nameInput = screen.getByLabelText("Name:");
        const emailInput = screen.getByLabelText("Email ID:");
        const maleRadio = screen.getByLabelText("Male");
        const phoneInput = screen.getByLabelText("Phone:");

        await user.type(nameInput, "John");
        await user.type(emailInput, "john@gmail.com");
        await user.click(maleRadio);
        await user.type(phoneInput, "8887776665");

        expect(nameInput).toHaveValue("John");
        expect(emailInput).toHaveValue("john@gmail.com");
        expect(maleRadio).toBeChecked();
        expect(phoneInput).toHaveValue("8887776665")
    });


    test("should display error for invalid email", async () => {
        const user = userEvent.setup();

        render(<App />);

        const emailInput = screen.getByLabelText("Email ID:");
        const registerButton = screen.getByRole("button", {
            name: "Register"
        });

        await user.type(emailInput, "john.com");
        await user.click(registerButton);

        expect(screen.getByText("Enter a valid email"))
            .toBeInTheDocument();
    });

    test("should display error for invalid phone", async () => {
        const user = userEvent.setup();

        render(<App />);

        const phoneInput = screen.getByLabelText("Phone:");
        const registerButton = screen.getByRole("button", {
            name: "Register"
        });

        await user.type(phoneInput, "12345");
        await user.click(registerButton);

        expect(screen.getByText("Phone must contain 10 digits")).toBeInTheDocument();

        
    });


    test("should call API and display success message", async () => {
        const user = userEvent.setup();
        // globalThis.fetch = async() => {
        //     return {
        //         ok: true,
        //         status: 200
        //     };
        // };

        const mockFetch = vi.fn();
        mockFetch.mockResolvedValue({
            ok:true,
            status: 200
        });

        globalThis.fetch = mockFetch;


        render(<App />);

        await user.type(screen.getByLabelText("Name:"), "John");
        await user.type(screen.getByLabelText("Email ID:"), "john@gmail.com");
        await user.click(screen.getByLabelText("Male"));
        await user.type(screen.getByLabelText("Phone:"), "9998887775");

        await user.click(screen.getByRole("button", {
            name: "Register"
        }));

        expect(await screen.findByText("Registration successful.")).toBeInTheDocument();
   

        expect(mockFetch).toHaveBeenCalledTimes(1);

        expect(mockFetch).toHaveBeenCalledWith(
            "https://localhost:7154/api/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "John",
                    email: "john@gmail.com",
                    gender: "Male",
                    phone: "9998887775"
                })
            }
        );
    });


    test ("should display duplicate email message", async ()=> {
        const user = userEvent.setup();

        globalThis.fetch = async () => {
            return {
                ok: false,
                status: 409
            };
        };

        render(<App />);

        await user.type(screen.getByLabelText("Name:"), "John");
        await user.type(screen.getByLabelText("Email ID:"), "John@gmail.com");
        await user.click(screen.getByLabelText("Male"));
        await user.type(screen.getByLabelText("Phone:"), "9877654321");

        await user.click(screen.getByRole("button", {
            name: "Register"
        }));

        expect(await screen.findByText("Email ID already exists.")).toBeInTheDocument();
    });

});