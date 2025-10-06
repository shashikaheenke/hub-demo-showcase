import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import PlaceholderCard from '../components/PlaceholderCard';
import TodayProductionCard from '../components/TodayProductionCard';
import YesterdayProductionCard from '../components/YesterdayProductionCard';
import WeeklyProductionCard from '../components/WeeklyProductionCard';
import TimesheetHoursCard from '../components/TimesheetHoursCard';
import ExternalLinks from '../components/ExternalLinks';
import MonthlyProductionCard from '../components/MonthlyProductionCard';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Index() {
  return (
    <Layout>
      <div className="w-full flex items-center justify-center mt-1 mb-4 select-none">
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-wide text-cyan-700 drop-shadow"
          style={{
            letterSpacing: '0.1em',
            textShadow: '0 2px 10px rgba(0,140,158,0.09)',
          }}
        >
          The HUB
        </h1>
      </div>
      <h2 className="text-base font-bold text-[#008C9E] mb-6">
        Welcome, Demo User
      </h2>

      {/* --- Main Dashboard Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-6">
        {/* Card 1: The new, functional card */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="h-full flex"
        >
          <div className="bg-white rounded-xl shadow p-5 flex flex-col h-full w-full">
            <TodayProductionCard />
          </div>
        </motion.div>

        {/* Card 2: Yesterday's Production*/}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="h-full flex"
        >
          <div className="bg-white rounded-xl shadow p-5 flex flex-col h-full w-full">
            <YesterdayProductionCard />
          </div>
        </motion.div>

        {/* Card 3: This Week's Production*/}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="h-full flex"
        >
          <div className="bg-white rounded-xl shadow p-5 flex flex-col h-full w-full">
            <WeeklyProductionCard />
          </div>
        </motion.div>

        {/* Card 4: Timesheet Hours*/}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="h-full flex"
        >
          <div className="bg-white rounded-xl shadow p-5 flex flex-col h-full w-full">
            <TimesheetHoursCard />
          </div>
        </motion.div>

        {/* Card 5: External Links*/}
        <motion.div
          custom={4}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="h-full flex"
        >
          <div className="bg-white rounded-xl shadow p-5 flex flex-col h-full w-full">
            <h3 className="text-base font-semibold text-[#008C9E] mb-2 select-none">
              External Links
            </h3>
            <ExternalLinks />
          </div>
        </motion.div>

        {/* Card 6: This Month's Production*/}
        <motion.div
          custom={5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="h-full flex"
        >
          <div className="bg-white rounded-xl shadow p-5 flex flex-col h-full w-full">
            <MonthlyProductionCard />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
