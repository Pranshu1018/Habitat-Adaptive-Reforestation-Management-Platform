import React from 'react';
import { motion } from 'framer-motion';
import { RiskAssessment } from '@/services/analytics/riskPredictor';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Droplets, Thermometer, Wind, AlertOctagon, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RiskTimelineProps {
    risks: RiskAssessment[];
    simulationMode?: boolean;
}

export const RiskTimeline: React.FC<RiskTimelineProps> = ({ risks, simulationMode = false }) => {
    if (!risks || risks.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-success/10 text-success text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                No significant risks detected in the upcoming window.
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'drought': return Droplets;
            case 'heat': return Thermometer;
            case 'flood': return Wind;
            case 'fire': return AlertTriangle;
            default: return AlertOctagon;
        }
    };

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 border-red-500/30 text-red-500';
            case 'high': return 'bg-destructive/10 border-destructive/30 text-destructive';
            case 'medium': return 'bg-warning/10 border-warning/30 text-warning';
            case 'low': return 'bg-primary/10 border-primary/30 text-primary';
            default: return 'bg-muted border-muted-foreground/30 text-muted-foreground';
        }
    };

    return (
        <div className="space-y-3">
            {risks.map((risk, index) => {
                const Icon = getIcon(risk.type);
                return (
                    <motion.div
                        key={risk.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "p-4 rounded-xl border relative overflow-hidden",
                            getSeverityStyle(risk.severity)
                        )}
                    >
                        {/* Simulation Badge Overlay */}
                        {simulationMode && (
                            <div className="absolute top-0 right-0 px-2 py-0.5 text-[10px] bg-background/50 backdrop-blur-sm rounded-bl-lg border-b border-l border-border/20">
                                SIM
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-current/10 shrink-0">
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-medium capitalize flex items-center gap-2">
                                        {risk.type} Risk
                                    </h4>
                                    <span className="text-sm font-bold">{risk.probability}%</span>
                                </div>

                                <p className="text-sm opacity-90 leading-relaxed mb-2">
                                    {risk.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 text-xs opacity-70 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>Expected: {format(new Date(risk.expectedDate), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span className="capitalize">{risk.severity} Severity</span>
                                    </div>
                                </div>

                                {/* Mitigation Actions */}
                                {risk.mitigationActions && risk.mitigationActions.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-current/10">
                                        <p className="text-xs font-semibold uppercase opacity-80 mb-2">Recommended Actions:</p>
                                        <ul className="space-y-1">
                                            {risk.mitigationActions.slice(0, 3).map((action, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs opacity-90">
                                                    <span className="text-current mt-1">•</span>
                                                    <span>{action}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
