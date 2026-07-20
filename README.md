# Food Price Monitor

Interactive bilingual dashboard developed for **SEG3525 – User Interface Analysis and Design** at the University of Ottawa.

The application allows users to explore monthly food prices across Canada using official Statistics Canada data. Users can compare provinces, visualize historical trends, and switch seamlessly between English and French.

---

## Features

- Interactive food price dashboard
- Monthly price trend visualization
- Province comparison chart
- Region selection (Canada or provinces)
- Multiple time ranges (12 months, 24 months, full history)
- Canada comparison mode
- Fully bilingual interface (English / French)
- Responsive design
- Automatic dataset generation from Statistics Canada

---

## Technologies

- React
- Vite
- Recharts
- react-i18next
- Lucide React

---

## Data Source

Statistics Canada

**Table 18-10-0245-01 — Average retail prices for selected products, monthly**

The application includes a custom data pipeline that downloads the official Statistics Canada dataset, processes it, generates bilingual product names, and exports an optimized JSON dataset consumed directly by the React application.

---

## Installation

```bash
npm install
```

---

## Run the development server

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Data Pipeline

Download the latest Statistics Canada dataset:

```bash
npm run data:download
```

Generate the application dataset:

```bash
npm run data:update
```

---

## Project Structure

```
src/
 ├── components/
 ├── hooks/
 ├── data/
 ├── locales/
 ├── utils/

scripts/
 ├── downloadStatCanData.js
 ├── updateFoodData.js
 └── lib/
```

---

## Artificial Intelligence Declaration

ChatGPT was used as a development assistant throughout this project.

The complete **user interface design (UI)**, **user experience (UX)**, visual identity, application architecture, dashboard layout, interaction design, component organization, and overall project conception were designed and implemented by the student.

Artificial intelligence was primarily used to assist with the development of the **Statistics Canada data processing pipeline**, including downloading, transforming, organizing, and generating the final bilingual dataset used by the application.

All AI-generated code was reviewed, understood, tested, and integrated by the student before being incorporated into the final project.

---

## License

This project was developed for educational purposes as part of SEG3525 at the University of Ottawa.
