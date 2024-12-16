import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { FoodDatabase, FoodItem } from "../utils/foodData";
import axios from 'axios';

interface MealItem extends FoodItem {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
}

const Calculator = () => {
  const [selectedItems, setSelectedItems] = useState<MealItem[]>([]);
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>([]);

  useEffect(() => {
    // Fetch the data when the component mounts
    FoodDatabase.then((data) => setFoodDatabase(data));
  }, []);

  const handleFoodSelect = (mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner', value: string) => {
    const selectedFood = foodDatabase.find(food => food.food_name === value);
    if (selectedFood) {
      setSelectedItems(prev => [...prev, {
        ...selectedFood,
        id: crypto.randomUUID(),
        mealType
      }]);
    }
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const getMealItems = (mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner') => {
    return selectedItems.filter(item => item.mealType === mealType);
  };

  const MealSection = ({ title, type }: { title: string; type: 'breakfast' | 'lunch' | 'snacks' | 'dinner' }) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
      <div className="relative">
        <input
          list={`${type}-list`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Type to search food..."
          onChange={(e) => handleFoodSelect(type, e.target.value)}
        />
        <datalist id={`${type}-list`}
          className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10"
          >
          {foodDatabase.map((food) => (
            <option key={food.food_name} value={food.food_name} />
          ))}
        </datalist>
      </div>
      
      <div className="space-y-2">
        {getMealItems(type).map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{item.food_name}</p>
              <p className="text-sm text-gray-600">
                Calories: {item.energy_kcal.toFixed(2)} kcal | Proteins: {item.protein_g.toFixed(2)}g | Carbs: {item.carb_g.toFixed(2)}g | Fats: {item.fat_g.toFixed(2)}g
              </p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    // Calculate totals
    const totals = selectedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.energy_kcal,
        proteins: acc.proteins + item.protein_g,
        carbs: acc.carbs + item.carb_g,
        fats: acc.fats + item.fat_g,
      }),
      { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );

    // Save to localStorage
    const mealData = {
      date: new Date().toLocaleDateString('en-CA'),
      meals: selectedItems,
      water: waterIntake,
      totals,
    };

    const {calories, proteins, carbs, fats} = mealData.totals;
    const upload_data = {
      date: new Date().toLocaleDateString('en-CA'),
      calories: calories,
      proteins: proteins,
      carbs: carbs,
      fats: fats,
      water: mealData.water
    }

    const deviceId = localStorage.getItem('deviceid');
    const username = localStorage.getItem('username');

    const userData = JSON.parse(localStorage.getItem('userProfile'));
    const goals = {
      caloriesGoal: userData.caloriesGoal,
      carbsGoal: userData.carbsGoal,
      proteinsGoal: userData.proteinsGoal,
      fatsGoal: userData.fatsGoal
    }

    try {
      const response = await fetch("https://pubfitnessstudio.pythonanywhere.com/update_user_nutritions", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upload_data: upload_data,
          deviceid: deviceId,
          username: username
        }),
        });

        const data = await response.json();

        console.log(data);
        
        if (data.status === "Meal data uploaded successfully!") {
          console.log('Meal data uploaded successfully');
          alert('Meal data uploaded successfully');
        } else {
          console.error('Error uploading meal data');
          alert('Error uploading meal data');
        }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error');
    }

    // try {
    //   const response = await axios.post('https://pubfitnessstudio.pythonanywhere.com/upload_mongo', body, {
    //     headers: {
    //       "Content-Type": "application/json", 
    //     }
    //   });
    //   if (response.status === 200) {
    //     console.log('Meal data uploaded successfully');
    //     alert('Meal data uploaded successfully');
    //   }
    // } catch (error) {
    //   console.error('Error uploading meal data:', error);
    //   alert('Error uploading meal data');
    // }

    const savedMeals = JSON.parse(localStorage.getItem("meals") || "[]");
    const index = savedMeals.findIndex(item => item.date === mealData.date);

    if (index !== -1){
      savedMeals[index] = mealData;
    } else {
      savedMeals.push(mealData);
    }
    
    localStorage.setItem("meals", JSON.stringify(savedMeals));

    // Reset form
    setSelectedItems([]);
    setWaterIntake(0);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Calorie Calculator
        </h1>

        <div className="space-y-8">
          <MealSection title="Breakfast" type="breakfast" />
          <MealSection title="Lunch" type="lunch" />
          <MealSection title="Snacks" type="snacks" />
          <MealSection title="Dinner" type="dinner" />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Water Intake</h2>
            <input
              type="number"
              value={waterIntake}
              onChange={(e) => setWaterIntake(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter water intake in ml"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          SUBMIT MEAL DATA
        </button>
      </div>
    </Layout>
  );
};

export default Calculator;