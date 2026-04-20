import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerClassName, className, ...props }, ref) => {
    return (
      <View className={cn('w-full', containerClassName)}>
        {label && (
          <Text className="text-sm font-helvetica text-muted-foreground mb-2">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'w-full px-4 py-4 rounded-xl bg-muted font-helvetica text-base text-foreground',
            error && 'border border-error',
            className
          )}
          placeholderTextColor="#A3A3A3"
          {...props}
        />
        {error && (
          <Text className="text-xs font-helvetica text-error mt-1.5">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
