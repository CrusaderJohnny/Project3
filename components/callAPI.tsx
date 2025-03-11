import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const NumberFact = () => {
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [fact, setFact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState(31);
  const timeoutId = useRef(null);

  useEffect(() => {
    if (month === 2) {
      setDaysInMonth(29);
    } else if ([4, 6, 9, 11].includes(month)) {
      setDaysInMonth(30);
    } else {
      setDaysInMonth(31);
    }
  }, [month]);

  useEffect(() => {
    const fetchFact = async () => {
      if (day && month) {
        setIsLoading(true);
        setError(null);

        if (timeoutId.current) {
          clearTimeout(timeoutId.current); // Clear previous timeout
        }

        timeoutId.current = setTimeout(async () => {
          try {
            const response = await fetch(
              `https://numbersapi.p.rapidapi.com/${month}/${day}/date?json=true`,
              {
                method: 'GET',
                headers: {
                  'X-RapidAPI-Key': 'dd91f9b709mshd93f8865c33e67dp1f996cjsnf6b2c61ba762', 
                  'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com',
                },
              }
            );

            if (!response.ok) {
              if (response.status === 429) {
                setError('Too many requests. Please try again later.');
              } else {
                setError(`HTTP error! status: ${response.status}`);
              }
              setIsLoading(false);
              return;
            }

            const result = await response.json();
            setFact(result.text);
            setIsLoading(false);
          } catch (err) {
            setError(err);
            setIsLoading(false);
          }
        }, 500); // 500ms delay
      }
    };

    fetchFact();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };

  }, [month, day]);


  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={month}
        style={styles.picker}
        onValueChange={(itemValue) => setMonth(itemValue)}
      >
        {months.map((m) => (
          <Picker.Item key={m.value} label={m.label} value={m.value} />
        ))}
      </Picker>

      <Picker
        selectedValue={day}
        style={styles.picker}
        onValueChange={(itemValue) => setDay(itemValue)}
      >
        {days.map((d) => (
          <Picker.Item key={d} label={d.toString()} value={d} />
        ))}
      </Picker>

      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && (
        <View style={styles.error}>
          <Text>Error: {error.message}</Text>
        </View>
      )}

      {fact && (
        <View style={styles.fact}>
          <Text>{fact}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'flex-start'
  },
  picker: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
  },
  loading: {
    marginTop: 20,
  },
  error: {
    marginTop: 20,
  },
  fact: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default NumberFact;