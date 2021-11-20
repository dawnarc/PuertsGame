// Fill out your copyright notice in the Description page of Project Settings.


#include "GameplayHelper.h"

bool UGameplayHelper::LineTrace(const UObject* WorldContextObject, const FVector& Start, const FVector& End, ECollisionChannel Channel, FHitResult& OutHitResult)
{
	FCollisionQueryParams TraceParams;
	TraceParams.bReturnPhysicalMaterial = false;
	TraceParams.bTraceComplex = false;

	//FHitResult Hit(ForceInit);
	return WorldContextObject->GetWorld()->LineTraceSingleByChannel(OutHitResult, Start, End, Channel, TraceParams);
}
