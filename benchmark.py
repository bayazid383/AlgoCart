
import statistics
import time
from algorithms import consolidate_naive, consolidate_dictionary


def run_benchmark(record_count=10000, repeats=5):
    unique_count = record_count // 10

    items = [
        (f"P{i % unique_count:05d}", 10 + i % 90, 1 + i % 5)
        for i in range(record_count)
    ]

    results = {}

    for name, algorithm in [
        ("Naive traversal", consolidate_naive),
        ("Dictionary mapping", consolidate_dictionary)
    ]:
        times = []

        for _ in range(repeats):
            start = time.perf_counter()
            consolidated, total = algorithm(items)
            times.append((time.perf_counter() - start) * 1000)

        results[name] = {
            "median_ms": statistics.median(times),
            "items": consolidated,
            "total": total
        }

    naive = results["Naive traversal"]
    dictionary = results["Dictionary mapping"]

    print(f"Input records: {record_count}")
    print(f"Unique products: {unique_count}")
    print(f"Repetitions: {repeats}")
    print(f"Naive traversal median: {naive['median_ms']:.4f} ms")
    print(f"Dictionary mapping median: {dictionary['median_ms']:.4f} ms")

    if naive["items"] != dictionary["items"] or naive["total"] != dictionary["total"]:
        raise AssertionError("The algorithms produced different results.")

    speedup = naive["median_ms"] / dictionary["median_ms"]
    print(f"Speedup: {speedup:.2f}x")
    print("Correctness check: PASSED")


if __name__ == "__main__":
    run_benchmark()
