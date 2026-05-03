<?php

namespace App\Providers;

use App\Models\Activity;
use App\Models\Child;
use App\Models\Competence;
use App\Models\Group;
use App\Models\Guardian;
use App\Models\Idea;
use App\Models\Pack;
use App\Models\Planning;
use App\Models\ReportActivity;
use App\Models\Theme;
use App\Models\User;
use App\Policies\ActivityPolicy;
use App\Policies\ChildPolicy;
use App\Policies\CompetencePolicy;
use App\Policies\GroupPolicy;
use App\Policies\GuardianPolicy;
use App\Policies\IdeaPolicy;
use App\Policies\PackPolicy;
use App\Policies\PlanningPolicy;
use App\Policies\ReportActivityPolicy;
use App\Policies\ThemePolicy;
use App\Policies\UserPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * Used for binding interfaces to implementations in the IoC container.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     * Called after all services are registered.
     * Delegates to focused methods to keep boot() clean.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configurePolicies();
    }

    /**
     * Configure default behaviors for production-ready applications.
     *
     * - CarbonImmutable prevents accidental date mutations
     * - prohibitDestructiveCommands blocks DROP/TRUNCATE in production
     * - Password::defaults enforces strong passwords in production only
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
        Gate::policy(Activity::class,       ActivityPolicy::class);
        Gate::policy(Child::class,          ChildPolicy::class);
        Gate::policy(Competence::class,     CompetencePolicy::class);
        Gate::policy(Group::class,          GroupPolicy::class);
        Gate::policy(Guardian::class,       GuardianPolicy::class);
        Gate::policy(Idea::class,           IdeaPolicy::class);
        Gate::policy(Pack::class,           PackPolicy::class);
        Gate::policy(Planning::class,       PlanningPolicy::class);
        Gate::policy(ReportActivity::class, ReportActivityPolicy::class);
        Gate::policy(Theme::class,          ThemePolicy::class);
        Gate::policy(User::class,           UserPolicy::class);
    }
}