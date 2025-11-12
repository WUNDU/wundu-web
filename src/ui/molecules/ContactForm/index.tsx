"use client";
import { useState } from "react";
import TextInput from "@/ui/atoms/TextInput";
import { Button } from "@/ui/atoms";

const ContactForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextInput
        id="name"
        label="Nome completo"
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Digite seu nome completo"
        required
      />

      <TextInput
        id="email"
        label="E-mail"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Digite seu e-mail"
        required
      />

      <TextInput
        id="subject"
        label="Assunto"
        type="text"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        placeholder="Digite o assunto"
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-700">
          Mensagem
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Digite sua mensagem"
          required
          rows={5}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Enviar Mensagem
      </Button>
    </form>
  );
};

export default ContactForm;
