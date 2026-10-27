
def consolidate_naive(items):
    consolidated = []

    for item_id, unit_price, quantity in items:
        found = False

        for i in range(len(consolidated)):
            if consolidated[i][0] == item_id:
                old_id, old_price, old_quantity = consolidated[i]
                consolidated[i] = (
                    old_id,
                    old_price,
                    old_quantity + quantity
                )
                found = True
                break

        if not found:
            consolidated.append((item_id, unit_price, quantity))

    total_price = sum(
        price * quantity
        for _, price, quantity in consolidated
    )

    return consolidated, total_price


def consolidate_dictionary(items):
    consolidated = {}

    for item_id, unit_price, quantity in items:
        if item_id in consolidated:
            old_price, old_quantity = consolidated[item_id]
            consolidated[item_id] = (
                old_price,
                old_quantity + quantity
            )
        else:
            consolidated[item_id] = (unit_price, quantity)

    result = [
        (item_id, price, quantity)
        for item_id, (price, quantity) in consolidated.items()
    ]

    total_price = sum(
        price * quantity
        for _, price, quantity in result
    )

    return result, total_price
