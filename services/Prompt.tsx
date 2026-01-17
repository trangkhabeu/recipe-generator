export default {
  GENERATE_RECIPE_OPTION_PROMPT: `Depends on user instruction, create EXACTLY 3 different Recipe variant with Recipe Name ,
2 line description and main ingredient list in JSON format with field recipeName , description,ingredients (without size) only
`,
  GENERATE_COMPLETE_RECIPE_RECIPE: `
- As per recipe Name and Description, give me all list of ingredients as ingredient ,
- Emoji icons for each ingredient as icon, quantity as quantity, along with detail step by step recipe as steps,
- Total Calories as calories (ONLY NUMBER), Minutes to cook as cookTime and serving number as serve To (ONLY NUMBER),
- Give me category List for recipe from [Breakfast, Lunch, Dinner, Salad, Dessert, Fastfood, Drink, Cake] as category,
- Give me response in JSON format only (Return a single JSON object, not an array,No trailing commas.No markdown.)`,
};
