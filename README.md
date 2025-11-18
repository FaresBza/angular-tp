# Angular : Project with state management (NgRx), Storybook, and Material

## 1. Install dependencies
```bash
#Install base dependencies:
    - npm install

#NgRx (store, effects, devtools):
    - ng add @ngrx/store@latest
#or
    - npm install @ngrx/store @ngrx/effects @ngrx/store-devtools

#Storybook:
    - npx sb init

#Angular Material:
    - ng add @angular/material@latest
```

## 2. Run the project
```bash
    - ng serve
```

## 3. Run Storybook
```bash
    - npm run storybook
```

## 4. Where state lives
State is kept in the NgRx store under src/app/state. Use actions → reducers/effects → selectors; components dispatch actions and select slices of state.

## 5. BONUS 
For ProductRating component, instead of typing a product ID into an input to show a rating, use the products table (/products). Click a product row to go to the product page where the rating is shown. This is better for user experience and project performance.