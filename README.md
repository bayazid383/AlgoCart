# AlgoCart Studio

**Shopping Cart Optimization and Algorithm Performance Analysis**

AlgoCart Studio is a web-based application that demonstrates how different algorithms can optimize shopping cart data. It compares a traditional nested-loop approach with a dictionary-based approach to show how algorithm selection affects execution time and efficiency.

The project combines algorithm analysis, a Flask backend, an interactive web interface, automated testing, and online deployment.

## Live Demo

- **Live Website:** https://algocart.onrender.com/
- **GitHub Repository:** https://github.com/bayazid383/AlgoCart

## Features

- **Shopping Cart Optimization:** Consolidate duplicate product records and calculate combined quantities.
- **Algorithm Comparison:** Compare a naive nested-loop algorithm with a dictionary-based algorithm.
- **Performance Benchmarking:** Measure and compare execution times.
- **Interactive Dashboard:** View optimization results and algorithm insights through a web interface.
- **Automated Testing:** Verify algorithm behavior using Python unit tests.
- **Responsive Design:** Use the dashboard on different screen sizes.

## Technologies Used

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Flask | Backend web framework |
| HTML | Webpage structure |
| CSS | Styling and responsive design |
| JavaScript | Frontend interactions |
| Git | Version control |
| GitHub | Source code hosting |
| Render | Web application deployment |
| unittest | Automated testing |

## Project Structure

```text
AlgoCartStudio/
├── app.py
├── algorithms.py
├── benchmark.py
├── requirements.txt
├── .gitignore
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── tests/
    ├── __init__.py
    └── test_algorithms.py
```

## Algorithms

### 1. Naive Algorithm

The naive approach uses nested loops to identify and consolidate duplicate product records.

- **Worst-case time complexity:** \(O(n^2)\)
- **Advantage:** Straightforward implementation.
- **Limitation:** Repeated comparisons can become expensive for large inputs.

### 2. Dictionary-Based Algorithm

The dictionary-based approach uses product identifiers as dictionary keys to find existing records and combine their quantities.

- **Average time complexity:** \(O(n)\), assuming efficient dictionary operations.
- **Advantage:** Efficient processing of larger datasets.
- **Limitation:** Performance depends on the characteristics of dictionary operations and the input data.

## Benchmark Results

A recorded benchmark used 10,000 input records, 1,000 unique products, and five repetitions.

| Metric | Naive Algorithm | Dictionary-Based Algorithm |
|---|---:|---:|
| Median execution time | 130.2447 ms | 0.9278 ms |
| Average expected time complexity | — | \(O(n)\) |
| Worst-case time complexity | \(O(n^2)\) | Can exceed \(O(n)\) |

**Observed speedup:** Approximately 140.38× in the recorded benchmark.

The dictionary-based implementation reduced the measured execution time by approximately 99.29% compared with the naive implementation in this run.

These results are experimental measurements, not guarantees for every dataset or computer. Actual performance may vary with hardware, Python version, system load, and benchmark conditions.

## Installation and Setup

### Prerequisites

- Python 3
- Git
- pip

### 1. Clone the repository

```bash
git clone https://github.com/bayazid383/AlgoCart.git
cd AlgoCart
```

### 2. Create a virtual environment

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python app.py
```

Open the local address printed by Flask in your terminal, usually:

http://127.0.0.1:5000

## Running Tests

Run the automated test suite from the project root:

```bash
python -m unittest discover -s tests -v
```

The recorded test run passed four unit tests. Run the command above to verify the current version of the project in your environment.

## Deployment

The application is deployed using Render and connected to the GitHub repository.

Typical deployment settings for a Flask application with an `app` instance inside `app.py` are:

**Build command**

```bash
pip install -r requirements.txt
```

**Start command**

```bash
gunicorn app:app
```

These commands assume that `requirements.txt` includes Gunicorn and the application exposes a Flask instance named `app`.

For deployment instructions, visit the [Render documentation](https://render.com/docs).

## Learning Outcomes

This project demonstrates:

- The effect of algorithm selection on execution time.
- The practical use of Python dictionaries for efficient data processing.
- Backend development using Flask.
- Integration of frontend technologies with a Python backend.
- Automated testing and performance benchmarking.
- Version control with Git and GitHub.
- Deployment of a web application to a hosting platform.

## Future Improvements

- Benchmark additional dataset sizes.
- Measure memory consumption alongside execution time.
- Add more algorithms for comparison.
- Expand automated tests for edge cases.
- Improve benchmark reproducibility and reporting.

## Author

**Bayazid Hossain**

Developed as a project in software development, data processing, and algorithm performance analysis.
