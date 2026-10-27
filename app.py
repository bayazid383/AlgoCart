
from flask import Flask, render_template, request, jsonify
from algorithms import consolidate_naive, consolidate_dictionary
import time
import statistics
import random

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/optimize", methods=["POST"])
def optimize_cart():
    data = request.get_json(silent=True) or {}
    items = data.get("items", [])
    method = data.get("method", "dictionary")

    if not isinstance(items, list):
        return jsonify({"error": "Items must be a list."}), 400

    if len(items) > 2000:
        return jsonify({"error": "Maximum 2,000 items per request."}), 400

    try:
        validated_items = []

        for item in items:
            if not isinstance(item, dict):
                raise ValueError("Each item must be an object.")

            item_id = item.get("id")
            price = item.get("price")
            quantity = item.get("quantity")

            if not isinstance(item_id, str) or not item_id.strip():
                raise ValueError("Product ID is required.")

            if isinstance(price, bool) or not isinstance(price, (int, float)):
                raise ValueError("Price must be numeric.")

            if isinstance(quantity, bool) or not isinstance(quantity, int):
                raise ValueError("Quantity must be a whole number.")

            if price < 0 or quantity < 0:
                raise ValueError("Price and quantity cannot be negative.")

            validated_items.append((item_id.strip(), price, quantity))

        if method == "naive":
            function = consolidate_naive
        elif method == "dictionary":
            function = consolidate_dictionary
        else:
            return jsonify({"error": "Unknown algorithm."}), 400

        start = time.perf_counter()
        result, total = function(validated_items)
        elapsed_ms = (time.perf_counter() - start) * 1000

        return jsonify({
            "items": [
                {"id": item_id, "price": price, "quantity": quantity}
                for item_id, price, quantity in result
            ],
            "total": total,
            "records": len(validated_items),
            "unique_products": len(result),
            "elapsed_ms": round(elapsed_ms, 4),
            "method": method
        })

    except (ValueError, TypeError) as error:
        return jsonify({"error": str(error)}), 400


@app.route("/api/benchmark", methods=["POST"])
def benchmark_algorithms():
    data = request.get_json(silent=True) or {}
    record_count = data.get("record_count", 10000)
    repeats = data.get("repeats", 5)

    if isinstance(record_count, bool) or not isinstance(record_count, int):
        return jsonify({"error": "Record count must be an integer."}), 400

    if isinstance(repeats, bool) or not isinstance(repeats, int):
        return jsonify({"error": "Repeats must be an integer."}), 400

    if not 100 <= record_count <= 10000:
        return jsonify({"error": "Record count must be between 100 and 10,000."}), 400

    if not 3 <= repeats <= 7:
        return jsonify({"error": "Repeats must be between 3 and 7."}), 400

    rng = random.Random(42)
    unique_count = max(1, record_count // 10)

    items = [
        (f"P{i % unique_count:05d}", 10 + (i % 90), 1 + (i % 5))
        for i in range(record_count)
    ]
    rng.shuffle(items)

    naive_times = []
    dictionary_times = []

    expected_naive, expected_total = consolidate_naive(items)
    expected_dictionary, dictionary_total = consolidate_dictionary(items)

    if expected_naive != expected_dictionary or expected_total != dictionary_total:
        return jsonify({"error": "Algorithms produced different results."}), 500

    for _ in range(repeats):
        start = time.perf_counter()
        naive_result, _ = consolidate_naive(items)
        naive_times.append((time.perf_counter() - start) * 1000)

        start = time.perf_counter()
        dictionary_result, _ = consolidate_dictionary(items)
        dictionary_times.append((time.perf_counter() - start) * 1000)

        if naive_result != dictionary_result:
            return jsonify({"error": "Algorithm results do not match."}), 500

    naive_ms = statistics.median(naive_times)
    dictionary_ms = statistics.median(dictionary_times)

    return jsonify({
        "record_count": record_count,
        "unique_products": unique_count,
        "repeats": repeats,
        "naive_ms": round(naive_ms, 4),
        "dictionary_ms": round(dictionary_ms, 4),
        "speedup": round(naive_ms / dictionary_ms, 2) if dictionary_ms > 0 else None,
        "results_match": True
    })


if __name__ == "__main__":
    app.run(debug=True)
