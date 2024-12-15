import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import { format, addDays, subDays } from "date-fns";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const profile = {
    name: "PubFit",
    dob: "2000-01-01",
    gender: "Male",
    image: "/placeholder.svg",
    height: 172,
    weight: 70,
    caloriesGoal: 2500,
    proteinsGoal: 150,
    carbsGoal: 250,
    fatsGoal: 70,
  };
  
  let nutritionData = {
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
    water: 0,
    bmi: 0,
    caloriesGoal: 2500,
    proteinsGoal: 150,
    carbsGoal: 250,
    fatsGoal: 70,
  };

  const savedMeals = JSON.parse(localStorage.getItem("meals") || "[]");
  const userData = JSON.parse(localStorage.getItem("userProfile"));
  if(!userData){
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }
  const date = format(currentDate, "yyyy-MM-dd");
  const index = savedMeals.findIndex(item => item.date === date);
  nutritionData['bmi'] = userData.weight / ((userData.height * userData.height) / 10000);

  const { caloriesGoal, proteinsGoal, fatsGoal, carbsGoal } = userData;
  nutritionData = { ...nutritionData, caloriesGoal, proteinsGoal, fatsGoal, carbsGoal };

  if(index!==-1){
    const { calories, proteins, fats, carbs } = savedMeals[index].totals;
    nutritionData = { ...nutritionData, calories, proteins, fats, carbs };
    nutritionData['water'] = savedMeals[index].water;
  } 
  
  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  }
  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  }

  return (
    <Layout>
      <div className="p-4 max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM d, yyyy")}
          </h2>
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Calories</h3>
            <p className="text-2xl font-bold text-primary">
              {nutritionData.calories.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">kcal</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Proteins</h3>
            <p className="text-2xl font-bold text-secondary">
              {nutritionData.proteins.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">g</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Fats</h3>
            <p className="text-2xl font-bold text-brown-500">
              {nutritionData.fats.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">g</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Carbs</h3>
            <p className="text-2xl font-bold text-purple-500">
              {nutritionData.carbs.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">g</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Water</h3>
            <p className="text-2xl font-bold text-blue-500">
              {nutritionData.water}
              <span className="text-sm font-normal text-gray-500 ml-1">Liter</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">BMI</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {nutritionData.bmi.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">kg/m<sup>2</sup></span>
            </p>
          </div>

          <h2 className="flex justify-end">Nutrition</h2>
          <h2>Goals</h2>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Calories ({nutritionData.caloriesGoal} kcal)</h3>
            <p className="text-2xl font-bold text-primary">
              {((nutritionData.calories) * 100 /(nutritionData.caloriesGoal)).toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">%</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Proteins ({nutritionData.proteinsGoal} g)</h3>
            <p className="text-2xl font-bold text-secondary">
              {((nutritionData.proteins) * 100 /(nutritionData.proteinsGoal)).toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">%</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Fats ({nutritionData.fatsGoal} g)</h3>
            <p className="text-2xl font-bold text-brown-500">
              {((nutritionData.fats) * 100 /(nutritionData.fatsGoal)).toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">%</span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-2">Carbs ({nutritionData.carbsGoal} g)</h3>
            <p className="text-2xl font-bold text-purple-500">
              {((nutritionData.carbs) * 100 /(nutritionData.carbsGoal)).toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">%</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;