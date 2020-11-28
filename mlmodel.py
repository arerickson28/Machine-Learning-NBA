# Dependencies
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Load data
df = pd.read_csv('data/machineLearningDataSet.csv')

# Drop the null columns where all values are null -- nothing to drop
df = df.dropna(axis='columns', how='all')

# Drop Unnamed: 0
df = df.drop(columns=['Unnamed: 0'])

# Assign X (data) and y (target)
drop_col = ['gameID', 'homeTeamID', 'visitorTeamID', 'homeTeamWin']
X = df.drop(drop_col, axis=1)
y = df['homeTeamWin']

y_names = ['Lose', 'Win']

print(X.shape, y.shape)

# Split our data into training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)

# Scale your data
X_scaler = MinMaxScaler().fit(X_train)
X_train_scaled = X_scaler.transform(X_train)
X_test_scaled = X_scaler.transform(X_test)

# Label-encode data set
label_encoder = LabelEncoder()
label_encoder.fit(y_train)
encoded_y_train = label_encoder.transform(y_train)
encoded_y_test = label_encoder.transform(y_test)

# Convert encoded labels to one-hot-encoding
y_train_categorical = to_categorical(encoded_y_train)
y_test_categorical = to_categorical(encoded_y_test)

#--- Set up for deep learning model ---#
# -------------------------------------#
# Create a Neural Network model 
model = Sequential()

model.add(Dense(units=20, activation='relu', input_dim=6))
model.add(Dense(units=20, activation='relu'))
model.add(Dense(units=2, activation='softmax'))

model.summary()

# Compile and fit the model
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

model.fit(
    X_train_scaled,
    y_train_categorical,
    epochs=100,
    shuffle=True,
    verbose=2
)

# Scoring model
model_loss, model_accuracy = model.evaluate(X_test_scaled, y_test_categorical, verbose=2)
print(f'Deep Neural Network - Loss: {model_loss}, Accuracy: {model_accuracy}')

# Save the model
model.save('saved_deep_neural_game.h5')