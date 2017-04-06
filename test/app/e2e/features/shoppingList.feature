Feature: Shoppinglist API add ingredients

Scenario: add an ingredient to the shopping list

   Given I am 'jean.dupond@nowhere.com'
   When I add the ingredients '[{"ingredient": "banana", "quantity": 4, "unit": "piece"}]'
   Then result is 200
   When I get my shopping list
   Then the shoppinglist contains '{"ingredient": "banana", "quantity": 4, "unit": "piece"}' 