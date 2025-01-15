import { useForm, ValidationError } from "@formspree/react";
import React from "react";

const Contact = () => {
  const [state, handleSubmit] = useForm("mrbbdogp");

  if (state.succeeded) {
    return (
      <div className="text-center mt-36 text-3xl">
        <div>Your message has been sent</div>
        <p className="mt-6">We will be in contact with you shortly!</p>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-10">
      <header className="text-center mt-32 text-4xl text-red-500 font-semibold">
        Contact Us
      </header>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-8 mt-14"
      >
        <input
          placeholder="Your Email"
          maxLength={128}
          type="email"
          id="email"
          name="email"
          required
          className="bg-red-200 outline-none border-2 border-black rounded-3xl px-8 py-2 w-96 md:w-[500px]"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
        <input
          type="subject"
          maxLength={100}
          id="subject"
          placeholder="Subject"
          name="subject"
          required
          className="bg-red-200 outline-none border-2 border-black rounded-3xl px-8 py-2 w-96 md:w-[500px]"
        />
        <ValidationError
          prefix="Subject"
          field="subject"
          errors={state.errors}
        />
        <textarea
          placeholder="Message"
          maxLength={700}
          id="message"
          name="message"
          required
          className="bg-red-200 dark:bg-[#0e1118] dark:text-white outline-none border-2 border-black dark:border-white rounded-3xl px-8 py-2 w-96 h-80 md:w-[500px]"
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
        />
        <button className="bg-red-500 text-white py-4 px-8 rounded-lg">
          {state.submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
