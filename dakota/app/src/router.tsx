import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from './shell/AppShell';
import { AuthScreen } from './screens/Auth';
import { TodayScreen } from './screens/Today';
import { DiaryScreen } from './screens/Diary';
import { HorsesScreen } from './screens/Horses';
import { HorseDetailScreen } from './screens/HorseDetail';
import { ArenaScreen } from './screens/Arena';
import { ExerciseDetailScreen } from './screens/ExerciseDetail';
import { RidesScreen } from './screens/Rides';
import { RideDetailScreen } from './screens/RideDetail';
import { PaddocksScreen } from './screens/Paddocks';
import { HealthScreen } from './screens/Health';
import { AilmentDetailScreen } from './screens/AilmentDetail';
import { FeedRoomScreen } from './screens/FeedRoom';
import { FeedItemDetailScreen } from './screens/FeedItemDetail';
import { LearnScreen } from './screens/Learn';
import { LessonScreen } from './screens/Lesson';
import { PracticesScreen } from './screens/Practices';
import { WisdomScreen } from './screens/Wisdom';
import { FeedScreen } from './screens/Feed';
import { CircleScreen } from './screens/Circle';
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
      { path: 'horses', element: <HorsesScreen /> },
      { path: 'horses/:id', element: <HorseDetailScreen /> },
      { path: 'arena', element: <ArenaScreen /> },
      { path: 'arena/:id', element: <ExerciseDetailScreen /> },
      { path: 'rides', element: <RidesScreen /> },
      { path: 'rides/:id', element: <RideDetailScreen /> },
      { path: 'paddocks', element: <PaddocksScreen /> },
      { path: 'health', element: <HealthScreen /> },
      { path: 'health/:id', element: <AilmentDetailScreen /> },
      { path: 'feedroom', element: <FeedRoomScreen /> },
      { path: 'feedroom/:id', element: <FeedItemDetailScreen /> },
      { path: 'learn', element: <LearnScreen /> },
      { path: 'learn/:lessonId', element: <LessonScreen /> },
      { path: 'practices', element: <PracticesScreen /> },
      { path: 'wisdom', element: <WisdomScreen /> },
      { path: 'feed', element: <FeedScreen /> },
      { path: 'circle', element: <CircleScreen /> },
      { path: 'circle/:id', element: <FriendScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
