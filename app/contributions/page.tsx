'use client';

import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { MOCK_CONTRIBUTIONS } from "../../lib/mockData";
import { useAuth } from "../../context/AuthContext";

export default function ContributionsPage() {
  const { user } = useAuth();
  
  // Sort by points for leaderboard
  const leaderboard = [...MOCK_CONTRIBUTIONS].sort((a, b) => b.points - a.points);
  
  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.contributions}>
      <div className="min-h-[100dvh] bg-background p-4 animate-in fade-in duration-500 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top contributors this month</p>
        </div>

        {/* Top 3 Podium Visual */}
        <div className="flex items-end justify-center gap-2 mb-8 h-48 mt-8">
          
          {/* Rank 2 */}
          {top3[1] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-150">
              <div className="h-12 w-12 rounded-full bg-slate-200 border-2 border-slate-300 shadow flex items-center justify-center text-lg mb-2 relative">
                👨‍💻
                <span className="absolute -bottom-2 -right-2 bg-slate-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">#2</span>
              </div>
              <span className="text-xs font-semibold">{top3[1].employeeName}</span>
              <span className="text-xs text-muted-foreground">{top3[1].points} pts</span>
              <div className="w-20 h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-lg mt-2 border-x border-t border-slate-300 shadow-inner flex justify-center pt-2">
                <span className="text-slate-400 font-bold text-xl">2</span>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {top3[0] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-10">
              <div className="text-2xl animate-bounce mb-1">👑</div>
              <div className="h-16 w-16 rounded-full bg-yellow-100 border-2 border-yellow-400 shadow-lg flex items-center justify-center text-2xl mb-2 relative">
                👩‍💼
                <span className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">#1</span>
              </div>
              <span className="text-sm font-bold">{top3[0].employeeName}</span>
              <span className="text-xs text-yellow-600 font-bold">{top3[0].points} pts</span>
              <div className="w-24 h-32 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg mt-2 border-x border-t border-yellow-300 shadow-inner flex justify-center pt-3">
                <span className="text-yellow-600 font-black text-3xl drop-shadow-sm">1</span>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {top3[2] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="h-12 w-12 rounded-full bg-orange-100 border-2 border-orange-300 shadow flex items-center justify-center text-lg mb-2 relative">
                👱‍♂️
                <span className="absolute -bottom-2 -right-2 bg-orange-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">#3</span>
              </div>
              <span className="text-xs font-semibold">{top3[2].employeeName}</span>
              <span className="text-xs text-muted-foreground">{top3[2].points} pts</span>
              <div className="w-20 h-16 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg mt-2 border-x border-t border-orange-300 shadow-inner flex justify-center pt-2">
                <span className="text-orange-400 font-bold text-xl">3</span>
              </div>
            </div>
          )}
        </div>

        {/* Other Ranks */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-2">Other Contributors</h3>
          {others.length > 0 ? others.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-bold text-sm w-4">{i + 4}</span>
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-sm">👤</div>
                <div>
                  <p className="text-sm font-semibold">{c.employeeName}</p>
                  <p className="text-xs text-muted-foreground">{c.category}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-foreground">{c.points} pts</span>
            </div>
          )) : (
            <div className="text-center p-6 border border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground">Keep contributing to make it to the board!</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
