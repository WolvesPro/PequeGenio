# 🌟 PequeGenio PWA - App Educativa Infantil

![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)
![Vercel](https://img.shields.io/badge/Vercel-Deploys-black?style=for-the-badge&logo=vercel)

PequeGenio es una **Aplicación Web Progresiva (PWA)** interactiva, diseñada específicamente para tabletas (iPad/Android), con el objetivo de ayudar a niños de 6 años a aprender lectoescritura, matemáticas básicas y comprensión del tiempo de forma autónoma, guiada y gamificada.

Este proyecto nace como una herramienta personalizada para reforzar letras específicas (como la **T** y la **S**), aprender a trazar su nombre completo y fomentar el hábito de estudio diario en sesiones cortas de 30-45 minutos.

## 🚀 Características Principales

*   **Pizarra Mágica (Canvas API):** Un lienzo táctil donde los niños pueden trazar letras, números y palabras guiándose por patrones de fondo.
*   **Lectoescritura (A-Z y Nombre):** Abecedario completo con fonética, sílabas y un módulo especial para que aprendan a leer y escribir su nombre con apellidos.
*   **Matemáticas Visuales:** Números del 1 al 100, desglose interactivo de decenas y unidades, y un módulo de sumas y restas guiadas visualmente.
*   **El Calendario:** Enseñanza interactiva de los días de la semana, meses y años para armar y escribir la fecha del día.
*   **Lectura Guiada:** 7 cuentos cortos integrados con un reproductor de voz línea por línea y preguntas de comprensión lectora.
*   **Guía por Voz (TTS):** Utiliza la API nativa `speechSynthesis` del navegador para leer instrucciones, cuentos y sílabas, optimizada con voces premium en español.
*   **Gamificación y Progreso:** Sistema de misiones diarias, retención de rachas, recolección de estrellas y *quizzes* (diarios y semanales) que premian el esfuerzo con animaciones de confeti.
*   **Persistencia Local:** El progreso se guarda automáticamente en el `localStorage` del dispositivo, funcionando perfectamente de forma offline.

## 🛠️ Stack Tecnológico

*   **Frontend:** React 18 + TypeScript
*   **Estilos:** Tailwind CSS v4
*   **Build Tool:** Vite
*   **Iconos:** Lucide React
*   **Animaciones:** Canvas-Confetti
*   **Despliegue:** Vercel (Configurado para PWA fullscreen sin zoom accidental)

## 📱 Optimización para Tableta

La interfaz está construida con el paradigma de "Touch-First":
*   Botones extra grandes y espaciados generosos.
*   Tipografía redondeada y legible (`Fredoka`).
*   Bloqueo de gestos no deseados (como el *pinch-to-zoom* o el scroll de rebote) mediante metaetiquetas en el HTML y CSS (`touch-action: manipulation;`).

## ⚙️ Instalación y Desarrollo Local

1. Clona el repositorio:
   
```bash
   git clone [https://github.com/tu-usuario/pequegenio-app.git](https://github.com/tu-usuario/pequegenio-app.git)