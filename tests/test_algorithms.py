
import unittest

from algorithms import consolidate_naive, consolidate_dictionary


class TestShoppingCartAlgorithms(unittest.TestCase):

    def test_empty_cart(self):
        for algorithm in (consolidate_naive, consolidate_dictionary):
            with self.subTest(algorithm=algorithm.__name__):
                items, total = algorithm([])
                self.assertEqual(items, [])
                self.assertEqual(total, 0)

    def test_no_duplicate_products(self):
        cart = [
            ("A101", 100, 2),
            ("B202", 50, 3),
            ("C303", 20, 1)
        ]

        for algorithm in (consolidate_naive, consolidate_dictionary):
            with self.subTest(algorithm=algorithm.__name__):
                items, total = algorithm(cart)
                self.assertEqual(items, cart)
                self.assertEqual(total, 370)

    def test_duplicate_products(self):
        cart = [
            ("A101", 100, 2),
            ("B202", 50, 3),
            ("A101", 100, 4),
            ("C303", 20, 1),
            ("B202", 50, 2)
        ]

        expected_items = [
            ("A101", 100, 6),
            ("B202", 50, 5),
            ("C303", 20, 1)
        ]

        for algorithm in (consolidate_naive, consolidate_dictionary):
            with self.subTest(algorithm=algorithm.__name__):
                items, total = algorithm(cart)
                self.assertEqual(items, expected_items)
                self.assertEqual(total, 870)

    def test_zero_quantity(self):
        cart = [
            ("A101", 100, 0),
            ("B202", 50, 2)
        ]

        for algorithm in (consolidate_naive, consolidate_dictionary):
            with self.subTest(algorithm=algorithm.__name__):
                items, total = algorithm(cart)
                self.assertEqual(items, cart)
                self.assertEqual(total, 100)


if __name__ == "__main__":
    unittest.main()
