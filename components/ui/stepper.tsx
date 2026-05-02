"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick01Icon } from "@hugeicons/core-free-icons"

export interface StepperStep {
  label: string
  description?: string
}

interface StepperContextValue {
  activeStep: number
  totalSteps: number
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

export function useStepper(): StepperContextValue {
  const ctx = React.useContext(StepperContext)
  if (!ctx) {
    throw new Error("useStepper must be used within a Stepper component")
  }
  return ctx
}

interface StepperProps {
  steps: StepperStep[]
  activeStep: number
  onStepChange?: (step: number) => void
  children: React.ReactNode
  className?: string
}

export function Stepper({
                          steps,
                          activeStep,
                          onStepChange,
                          children,
                          className,
                        }: StepperProps) {
  const totalSteps = steps.length

  const goToStep = React.useCallback(
      (step: number) => {
        if (step >= 0 && step < totalSteps) {
          onStepChange?.(step)
        }
      },
      [totalSteps, onStepChange],
  )

  const nextStep = React.useCallback(() => {
    goToStep(activeStep + 1)
  }, [activeStep, goToStep])

  const prevStep = React.useCallback(() => {
    goToStep(activeStep - 1)
  }, [activeStep, goToStep])

  const value = React.useMemo<StepperContextValue>(
      () => ({
        activeStep,
        totalSteps,
        goToStep,
        nextStep,
        prevStep,
        isFirstStep: activeStep === 0,
        isLastStep: activeStep === totalSteps - 1,
      }),
      [activeStep, totalSteps, goToStep, nextStep, prevStep],
  )

  return (
      <StepperContext.Provider value={value}>
        <div className={cn("space-y-8", className)}>
          {/* Step indicators */}
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, index) => {
                const isCompleted = index < activeStep
                const isCurrent = index === activeStep

                return (
                    <li
                        key={step.label}
                        className={cn(
                            "relative flex-1",
                            index !== steps.length - 1 && "pe-8",
                        )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Connector line (before) */}
                        {index > 0 && (
                            <div
                                className={cn(
                                    "absolute inset-y-0 -inset-s-4 top-1/2 h-0.5 w-8 -translate-y-1/2",
                                    isCompleted || isCurrent ? "bg-primary" : "bg-muted",
                                )}
                            />
                        )}

                        {/* Step circle */}
                        <button
                            type="button"
                            onClick={() => isCompleted && goToStep(index)}
                            disabled={!isCompleted}
                            className={cn(
                                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                                isCompleted &&
                                "border-primary bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90",
                                isCurrent &&
                                "border-primary bg-background text-primary",
                                !isCompleted &&
                                !isCurrent &&
                                "border-muted bg-background text-muted-foreground cursor-default",
                            )}
                        >
                          {isCompleted ? (
                              <HugeiconsIcon icon={Tick01Icon} className="size-4" />
                          ) : (
                              index + 1
                          )}
                        </button>

                        {/* Label */}
                        <div className="hidden min-w-0 sm:block">
                          <p
                              className={cn(
                                  "text-sm font-medium",
                                  isCurrent
                                      ? "text-foreground"
                                      : "text-muted-foreground",
                              )}
                          >
                            {step.label}
                          </p>
                          {step.description && (
                              <p className="text-xs text-muted-foreground">
                                {step.description}
                              </p>
                          )}
                        </div>
                      </div>
                    </li>
                )
              })}
            </ol>
          </nav>

          {/* Step content */}
          <div>{children}</div>
        </div>
      </StepperContext.Provider>
  )
}

interface StepperContentProps {
  step: number
  children: React.ReactNode
  className?: string
}

export function StepperContent({ step, children, className }: StepperContentProps) {
  const { activeStep } = useStepper()

  if (step !== activeStep) return null

  return (
      <div className={cn("animate-slide-up-fade", className)}>
        {children}
      </div>
  )
}