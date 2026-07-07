import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from './shell/AppShell';
import { AuthScreen } from './screens/Auth';
import { TodayScreen } from './screens/Today';
import { DiaryScreen } from './screens/Diary';
import { FoodsScreen } from './screens/Foods';
import { FoodDetailScreen } from './screens/FoodDetail';
import { MealDetailScreen } from './screens/MealDetail';
import { TreatmentsScreen } from './screens/Treatments';
import { TreatmentDetailScreen } from './screens/TreatmentDetail';
import { LearnScreen } from './screens/Learn';
import { LessonScreen } from './screens/Lesson';
import { PracticesScreen } from './screens/Practices';
import { WisdomScreen } from './screens/Wisdom';
import { FeedScreen } from './screens/Feed';
import { CareScreen } from './screens/Care';
import { FriendScreen } from './screens/Friend';
import { ProfileScreen } from './screens/Profile';

export const router = createBrowserRouter([
  { path: '/auth', element: <AuthScreen /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <TodayScreen /> },
      { path: 'diary', element: <DiaryScreen /> },
      { path: 'foods', element: <FoodsScreen /> },
      { path: 'foods/:id', element: <FoodDetailScreen /> },
      { path: 'meals/:id', element: <MealDetailScreen /> },
      { path: 'treatments', element: <TreatmentsScreen /> },
      { path: 'treatments/:id', element: <TreatmentDetailScreen /> },
      { path: 'learn', element: <LearnScreen /> },
      { path: 'learn/:lessonId', element: <LessonScreen /> },
      { path: 'practices', element: <PracticesScreen /> },
      { path: 'wisdom', element: <WisdomScreen /> },
      { path: 'feed', element: <FeedScreen /> },
      { path: 'care', element: <CareScreen /> },
      { path: 'care/:id', element: <FriendScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
