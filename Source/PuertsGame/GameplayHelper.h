// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "GameplayHelper.generated.h"

/**
 * 
 */
UCLASS(meta=(ScriptName="GameplayHelper"))
class PUERTSGAME_API UGameplayHelper : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()

public:

	UFUNCTION(BlueprintCallable)
	static bool LineTrace(const UObject* WorldContextObject, const FVector& Start, const FVector& End, ECollisionChannel Channel, FHitResult& OutHitResult);
};
