
const $ = (id) => document.getElementById(id);

let cartItems = [];
let lastResult = null;
let toastTimeout;

const money = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);

const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

function showToast(message, isError = false) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function invalidateResults() {
    lastResult = null;

    $("recordMetric").textContent = "0";
    $("uniqueMetric").textContent = "0";
    $("totalMetric").textContent = "$0.00";
    $("timeMetric").textContent = "—";
    $("outputTotal").textContent = "$0.00";

    $("resultTableBody").innerHTML =
        '<tr class="empty-row"><td colspan="4">Run optimization to see consolidated results.</td></tr>';

    $("resultSummary").innerHTML = `
        <div class="result-summary-top">
            <span>OPTIMIZATION RESULT</span>
            <span class="result-status">READY</span>
        </div>
        <p>Your cart changed. Run optimization to update the results.</p>
    `;

    $("benchmarkEmpty").hidden = false;
    $("benchmarkResults").hidden = true;
}

function renderCart() {
    const body = $("cartTableBody");

    $("cartCount").textContent =
        `${cartItems.length} ${cartItems.length === 1 ? "record" : "records"}`;

    $("inputSummary").textContent =
        `${cartItems.length} record${cartItems.length === 1 ? "" : "s"} added`;

    if (cartItems.length === 0) {
        body.innerHTML =
            '<tr class="empty-row"><td colspan="4">Your cart is empty. Add an item or load sample data.</td></tr>';
        return;
    }

    body.innerHTML = cartItems.map((item, index) => `
        <tr>
            <td><strong>${escapeHTML(item.id)}</strong></td>
            <td>${money(item.price)}</td>
            <td>${item.quantity}</td>
            <td>
                <button
                    type="button"
                    class="remove-item"
                    data-index="${index}"
                    aria-label="Remove ${escapeHTML(item.id)}"
                    title="Remove item"
                >×</button>
            </td>
        </tr>
    `).join("");
}

$("addItemForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const id = $("productId").value.trim();
    const price = Number($("productPrice").value);
    const quantity = Number($("productQuantity").value);

    if (!id) {
        showToast("Please enter a product ID.", true);
        return;
    }

    if (!Number.isFinite(price) || price < 0 || price > 1e9) {
        showToast("Enter a valid unit price.", true);
        return;
    }

    if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > 1e9) {
        showToast("Quantity must be a non-negative whole number.", true);
        return;
    }

    if (cartItems.length >= 2000) {
        showToast("The interactive cart is limited to 2,000 records.", true);
        return;
    }

    cartItems.push({ id, price, quantity });

    renderCart();
    invalidateResults();
    $("addItemForm").reset();
    $("productId").focus();

    showToast("Product added to your cart.");
});

$("cartTableBody").addEventListener("click", (event) => {
    const button = event.target.closest(".remove-item");

    if (!button) return;

    const index = Number(button.dataset.index);

    if (!Number.isInteger(index) || index < 0 || index >= cartItems.length) {
        return;
    }

    cartItems.splice(index, 1);
    renderCart();
    invalidateResults();
    showToast("Cart record removed.");
});

$("clearCartBtn").addEventListener("click", () => {
    cartItems = [];
    renderCart();
    invalidateResults();
    showToast("Cart cleared.");
});

$("loadSampleBtn").addEventListener("click", () => {
    cartItems = [
        { id: "A101", price: 100, quantity: 2 },
        { id: "B202", price: 50, quantity: 3 },
        { id: "A101", price: 100, quantity: 4 },
        { id: "C303", price: 20, quantity: 1 },
        { id: "B202", price: 50, quantity: 2 }
    ];

    renderCart();
    invalidateResults();
    showToast("Sample data loaded successfully.");
});

$("algorithmSelect").addEventListener("change", () => {
    const method = $("algorithmSelect").value;
    const info = $("algorithmInfo");

    if (method === "naive") {
        info.innerHTML = `
            <span class="info-icon">◇</span>
            <div>
                <strong>Naive traversal</strong>
                <p>Scans existing products to find matching IDs. Worst-case time complexity: O(n²).</p>
            </div>
        `;
    } else {
        info.innerHTML = `
            <span class="info-icon">◇</span>
            <div>
                <strong>Dictionary mapping</strong>
                <p>Uses product IDs as dictionary keys. Average time complexity: O(n).</p>
            </div>
        `;
    }
});

async function callOptimizer(items, method) {
    const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ items, method })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Optimization failed.");
    }

    return data;
}

function renderResults(data) {
    $("recordMetric").textContent = data.records.toLocaleString();
    $("uniqueMetric").textContent = data.unique_products.toLocaleString();
    $("totalMetric").textContent = money(data.total);
    $("timeMetric").textContent = `${data.elapsed_ms.toFixed(4)} ms`;
    $("outputTotal").textContent = money(data.total);

    if (data.items.length === 0) {
        $("resultTableBody").innerHTML =
            '<tr class="empty-row"><td colspan="4">No products to display.</td></tr>';
    } else {
        $("resultTableBody").innerHTML = data.items.map((item) => `
            <tr>
                <td><strong>${escapeHTML(item.id)}</strong></td>
                <td>${money(item.price)}</td>
                <td>${item.quantity.toLocaleString()}</td>
                <td>${money(item.price * item.quantity)}</td>
            </tr>
        `).join("");
    }

    $("resultSummary").innerHTML = `
        <div class="result-summary-top">
            <span>OPTIMIZATION RESULT</span>
            <span class="result-status">COMPLETE</span>
        </div>
        <p>Processed ${data.records} input records into ${data.unique_products} unique products in ${data.elapsed_ms.toFixed(4)} ms using ${data.method === "naive" ? "naive traversal" : "dictionary mapping"}.</p>
    `;
}

$("optimizeBtn").addEventListener("click", async () => {
    const button = $("optimizeBtn");
    const method = $("algorithmSelect").value;

    button.disabled = true;
    button.textContent = "Processing...";

    try {
        const data = await callOptimizer(cartItems, method);
        lastResult = data;
        renderResults(data);
        showToast("Optimization completed successfully.");
    } catch (error) {
        showToast(error.message || "Could not connect to the server.", true);
    } finally {
        button.disabled = false;
        button.innerHTML = 'Run optimization <span>→</span>';
    }
});


$("benchmarkBtn").addEventListener("click", async () => {
    const button = $("benchmarkBtn");
    button.disabled = true;
    button.textContent = "Benchmarking 10,000 records...";

    try {
        const response = await fetch("/api/benchmark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                record_count: 10000,
                repeats: 5
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Benchmark failed.");
        }

        $("naiveTime").textContent = `${data.naive_ms.toFixed(4)} ms`;
        $("dictionaryTime").textContent =
            `${data.dictionary_ms.toFixed(4)} ms`;

        const maxTime = Math.max(data.naive_ms, data.dictionary_ms, 0.0001);

        $("naiveBar").style.width =
            `${Math.max(1, data.naive_ms / maxTime * 100)}%`;

        $("dictionaryBar").style.width =
            `${Math.max(1, data.dictionary_ms / maxTime * 100)}%`;

        $("speedupValue").textContent =
            data.speedup === null ? "N/A" : `${data.speedup.toFixed(2)}×`;

        $("speedupDescription").textContent =
            `Median of ${data.repeats} runs on ${data.record_count.toLocaleString()} records.`;

        $("benchmarkEmpty").hidden = true;
        $("benchmarkResults").hidden = false;

        showToast(
            data.results_match
                ? "Benchmark completed. Both algorithms match."
                : "Benchmark completed, but results differ.",
            !data.results_match
        );
    } catch (error) {
        showToast(error.message || "Benchmark failed.", true);
    } finally {
        button.disabled = false;
        button.innerHTML = 'Compare algorithms <span>→</span>';
    }
});


document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

renderCart();
