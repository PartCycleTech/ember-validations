module.exports = {
  scenarios: [
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-lts-2.16',
      npm: {
        devDependencies: {
          'ember-source': '~2.16.0'
        }
      }
    },
    {
      name: 'ember-2',
      bower: {
        dependencies: {
          "ember": "~2.0.0"
        }
      }
    },
    {
      name: 'ember-lts',
      bower: {
        dependencies: {
          "ember": "~2.4.0"
        }
      }
    },
    {
      name: 'ember-latest',
      bower: {
        dependencies: {
          "ember": "release"
        },
        resolutions: {
          "ember": "release"
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-beta',
      allowedToFail: true,
      bower: {
        dependencies: {
          "ember": "beta"
        },
        resolutions: {
          "ember": "beta"
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-canary',
      allowedToFail: true,
      bower: {
        dependencies: {
          "ember": "canary"
        },
        resolutions: {
          "ember": "canary"
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-alpha',
      allowedToFail: true,
      bower: {
        dependencies: {
          "ember": "alpha"
        },
        resolutions: {
          "ember": "alpha"
        }
      }
    },
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};
