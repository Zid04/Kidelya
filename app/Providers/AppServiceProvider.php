<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configurePolicies();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
     protected function configurePolicies(): void
    {
        Gate::policy(Activity::class, ActivityPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Child::class, ChildPolicy::class);
        Gate::policy(Competence::class, CompetencePolicy::class);
        Gate::policy(Group::class, GroupPolicy::class);
        Gate::policy(Guardian::class, GuardianPolicy::class);
        Gate::policy(Idea::class, IdeaPolicy::class);
        Gate::policy(Pack::class, PackPolicy::class);
        Gate::policy(Planning::class, PlanningPolicy::class);
        Gate::policy(ReportActivity::class, ReportActivityPolicy::class);
        Gate::policy(Theme::class, ThemePolicy::class);
    }
}
