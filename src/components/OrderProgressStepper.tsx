import React from 'react';
import { CheckCircle, Circle, Loader2, Truck, PackageCheck } from 'lucide-react'; // Example icons

interface Step {
  id: string;
  name: string;
  icon?: React.ElementType;
}

interface OrderProgressStepperProps {
  steps: Step[];
  currentStepId: string; // ID of the current active step
  completedStepIds?: string[]; // IDs of steps already completed (optional, can be derived)
}

const OrderProgressStepper: React.FC<OrderProgressStepperProps> = ({
  steps,
  currentStepId,
  completedStepIds = [],
}) => {
  console.log("Rendering OrderProgressStepper, current step:", currentStepId);

  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedStepIds.includes(step.id) || index < currentStepIndex;
          const isActive = step.id === currentStepId;
          const IconComponent = step.icon || (isCompleted ? CheckCircle : (isActive ? Loader2 : Circle));

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2
                    ${isActive ? 'border-orange-500 bg-orange-100 text-orange-600 animate-pulse' : ''}
                    ${isCompleted ? 'border-green-500 bg-green-100 text-green-600' : ''}
                    ${!isActive && !isCompleted ? 'border-gray-300 bg-gray-100 text-gray-400' : ''}
                  `}
                >
                  <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive && step.icon === Loader2 ? 'animate-spin' : ''}`} />
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-medium
                  ${isActive ? 'text-orange-600' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                `}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded
                  ${isCompleted || index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}
                `}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Example Usage:
        <OrderProgressStepper
            steps={[
                { id: 'confirmed', name: 'Confirmed', icon: PackageCheck },
                { id: 'preparing', name: 'Preparing', icon: Loader2 },
                { id: 'on_way', name: 'On The Way', icon: Truck },
                { id: 'delivered', name: 'Delivered', icon: CheckCircle },
            ]}
            currentStepId="preparing"
            completedStepIds={["confirmed"]}
        />
      */}
    </div>
  );
};
export default OrderProgressStepper;